/* global Utils, fileManager, log, formatter */

/*
 * XMLHttpRequest Polyfill
 */
(function (exports) {
    if (exports.XMLHttpRequest) {
        return;
    }
    exports.XMLHttpRequest = Java.type('io.milton.cloud.server.repoapps.http.XMLHttpRequest');
})(this);


/*
 * FormData Polyfill
 */
(function (exports) {
    if (exports.FormData) {
        return;
    }
    exports.FormData = Java.type('io.milton.cloud.server.repoapps.http.FormData');
})(this);

(function (g) {
    g._configToParam = function (config) {
        if (Utils.isNull(config)) {
            return '';
        }

        var param = '';

        for (var propertyName in config) {
            var value = config[propertyName];
            if (Utils.isStringNotBlank(propertyName)) {
                param += propertyName + '=' + Utils.safeString(value) + '&';
            }
        }

        if (param.endsWith('&')) {
            param = param.substring(0, param.length - 1);
        }

        return param;
    };

    g._sendRequest = function (page, url, config) {
        var params = g._configToParam(config);
        var finalUrl = url + '?' + params;

        // First we need to check the cache
        var cachedItem = g.Pixabay.CACHE.getCachedItem(page, finalUrl);
        if (Utils.isNotNull(cachedItem)) {
            return cachedItem;
        }

        var xml = new XMLHttpRequest();

        var result = {
            status: null,
            statusCode: null,
            rateLimit: {
                limit: null,
                remaining: null,
                reset: null
            },
            result: null
        };

        xml.addEventListener('load', function () {
            var responseText = xml.getResponseText();

            result.status = xml.statusText;
            result.statusCode = xml.status;
            result.rateLimit.limit = xml.getResponseHeader('X-RateLimit-Limit');
            result.rateLimit.remaining = xml.getResponseHeader('X-RateLimit-Remaining');
            result.rateLimit.reset = xml.getResponseHeader('X-RateLimit-Reset');

            if (result.statusCode >= 200 && result.statusCode < 300) {
                try {
                    result.result = JSON.parse(responseText);
                } catch (e) {
                    result.errorMsg = 'Exception: ' + e + ' - Msg: ' + e.message;
                }
            } else {
                result.errorMsg = responseText;
            }


        });

        xml.addEventListener('error', function () {
            result.status = xml.statusText;
            result.statusCode = xml.status;
        });

        xml.open('GET', finalUrl, false);
        xml.send();

        if (result.statusCode >= 200 && result.statusCode < 300) {
            g.Pixabay.CACHE.addItem(page, finalUrl, JSON.stringify(result));
        }

        return result;
    };

    g._fetchFile = function (page, url, config, size) {
        if (Utils.isStringBlank(config.id)) {
            return {
                status: 'Invalid Image ID',
                statusCode: 500,
                result: null
            };
        }

        var searchConfig = {
            key: config.key,
            id: config.id
        };

        if (config.id.match(/[a-z]/i)) {
            searchConfig.response_group = 'high_resolution';
        }

        var searchResult = g._sendRequest(page, url, searchConfig);

        var result = {
            status: null,
            statusCode: null,
            result: null
        };

        if (!(searchResult.statusCode >= 200 && searchResult.statusCode < 300)) {
            result.status = searchResult.status;
            result.statusCode = searchResult.statusCode;

            return result;
        }

        if (searchResult.result.hits.length < 1) {

        }
        var hit = searchResult.result.hits[0];
        var imgUrl = hit.webformatURL;

        if (Utils.isStringNotBlank(size)) {
            var ext = Utils.getFileExt(imgUrl);
            imgUrl = imgUrl.replace('_' + hit.webformatWidth + '.' + ext, '_' + size + '.' + ext);
        }

        log.info('Image Download URL: {}', imgUrl);

        // First we need to check the cache
        var cachedItem = g.Pixabay.CACHE.getCachedItem(page, imgUrl);
        if (Utils.isNotNull(cachedItem)) {
            return cachedItem;
        }

        var xml = new XMLHttpRequest();

        xml.addEventListener('load', function () {
            result.status = xml.statusText;
            result.statusCode = xml.status;

            if (result.statusCode >= 200 && result.statusCode < 300) {
                var imageBytes = xml.response.responseBodyAsBytes;
                var fileHash = fileManager.upload(imageBytes);
                var dimensions = fileManager.utils.imageDimensions(fileHash);
                result.result = {
                    hash: fileHash,
                    contentType: null,
                    fileName: fileHash + '.' + Utils.getFileExt(imgUrl),
                    imageWidth: dimensions.width,
                    imageHeight: dimensions.height
                };
            } else {
                result.errorMsg = xml.getResponseText();
            }
        });

        xml.open('GET', imgUrl, false);
        xml.send();

        g.Pixabay.CACHE.addItem(page, imgUrl, JSON.stringify(result));

        return result;
    };
})(this);