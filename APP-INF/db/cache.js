/* global Utils, formatter, securityManager */

(function (g) {
    if (Utils.isNull(g.Pixabay)) {
        g.Pixabay = {};
    }

    g.Pixabay.CACHE = {
        _getHash: function (URL) {
            var sha1 = formatter.crypto.createHash('SHA-1');
            var sha1Bytes = sha1.digest(Utils.safeString(URL).getBytes());

            var hashString = '';
            for (var i = 0; i < sha1Bytes.length; i++) {
                var hex = ('0' + (sha1Bytes[i] & 0xFF).toString(16)).slice(-2);
                hashString = hashString + hex;
            }

            return hashString;
        },
        _isRecordValid: function (record) {
            if (Utils.isNotNull(record)) {
                var recordJson = JSON.parse(record.json);

                if (Utils.isNull(recordJson.createdDate)) {
                    return false;
                }

                var createdDate = Utils.safeInt(recordJson.createdDate);
                var now = (new Date()).getTime();
                var hours = Math.abs(createdDate - now) / 3600000;

                log.info('_isRecordValid | Created Date: {} | Now: {} | Hours: {}', createdDate, now, hours);

                if (hours < 24) {
                    return true;
                }
            }

            return false;
        },
        getCachedItem: function (page, URL) {
            var db = _getOrCreateUrlDb(page);
            var hash = g.Pixabay.CACHE._getHash(URL);

            var record = db.child(g._config.RECORD_NAMES.SEARCH_CACHE(hash));

            if (g.Pixabay.CACHE._isRecordValid(record)) {
                return JSON.parse(JSON.parse(record.json).result);
            } else if (Utils.isNotNull(record)) {
                record.delete();
            }

            return null;
        },
        addItem: function (page, URL, results) {
            log.info('Adding cache record');
            var db;
            try {
                db = g._getOrCreateUrlDb(page);
            } catch (e) {
                log.error('Error getting Db: {}', e.message, e);
                throw e;
            }
            log.info('Got DB {}', db);
            var hash = g.Pixabay.CACHE._getHash(URL);
            log.info('Got Cache Hash: {}', hash);
            var currentUser = securityManager.currentUser;
            log.info('Got current User: {}', currentUser);

            var item = {
                url: URL,
                createdDate: formatter.now.getTime(),
                createdBy: (Utils.isNotNull(currentUser) ? currentUser.name : null),
                result: results
            };

            log.info('Got Cache Item: {}', item);

            db.createNew(g._config.RECORD_NAMES.SEARCH_CACHE(hash), JSON.stringify(item), g._config.RECORD_TYPES.SEARCH_CACHE);
        }
    };
})(this);