/* global Utils */

(function (g) {
    g._configToParam = function (config) {
        if (Utils.isNull(config)) {
            return '';
        }

        var param = '';

        $.each(config, function (propertyName, value) {
            if (Utils.isStringNotBlank(propertyName)) {
                param += propertyName + '=' + Utils.safeString(value) + '&';
            }
        });

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

        var responseText = null;
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

        xml.addEventListener("load", function () {
            responseText = xml.getResponseText();

            result.status = xml.statusText;
            result.statusCode = xml.status;
            result.rateLimit.limit = xml.getResponseHeader('X-RateLimit-Limit');
            result.rateLimit.remaining = xml.getResponseHeader('X-RateLimit-Remaining');
            result.rateLimit.reset = xml.getResponseHeader('X-RateLimit-Reset');
        });

        xml.addEventListener('type', function () {
            result.status = xml.statusText;
            result.statusCode = xml.status;
        });

        xml.open('GET', finalUrl, false);
        xml.send();

        if (Utils.isStringNotBlank(responseText)) {
            try {
                result.result = JSON.parse(responseText);
                
                g.Pixabay.CACHE.addItem(page, finalUrl, responseText);
            } catch (e) {
                result.result = responseText;
            }
        }

        return result;
    };
})(this);