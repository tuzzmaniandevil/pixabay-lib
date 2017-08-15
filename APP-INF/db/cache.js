/* global Utils, formatter, securityManager */

(function (g) {
    if (Utils.isNull(g.Pixabay)) {
        g.Pixabay = {};
    }

    g.Pixabay.CACHE = {
        _getHash: function (URL) {
            var sha1 = formatter.crypto.createHash('SHA-1');
            return formatter.toBase64String(sha1.digest(Utils.safeString(URL).getBytes()));
        },
        _isRecordValid: function (record) {
            if (Utils.isNotNull(record)) {
                var recordJson = JSON.parse(record.json);

                var createdDate = formatter.toDate(recordJson.createdDate);
                if (Utils.isNotNull(createdDate)) {
                    var durationHours = formatter.durationHours(createdDate, formatter.now);
                    if (durationHours <= 24) {
                        return true;
                    }
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
            }

            return null;
        },
        addItem: function (page, URL, results) {
            var db = g._getOrCreateUrlDb(page);
            var hash = g.Pixabay.CACHE._getHash(URL);
            var currentUser = securityManager.currentUser;

            var item = {
                url: URL,
                createdDate: formatter.formatDateISO8601(formatter.now),
                createdBy: (Utils.isNotNull(currentUser) ? currentUser.name : null),
                result: results
            };

            db.createNew(g._config.RECORD_NAMES.SEARCH_CACHE(hash), JSON.stringify(item), g._config.RECORD_TYPES.SEARCH_CACHE);
        }
    };
})(this);