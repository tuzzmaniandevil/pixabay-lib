/* global Utils */

(function (g) {
    if (Utils.isNull(g.Pixabay)) {
        g.Pixabay = {};
    }

    if (Utils.isNull(g.Pixabay.MAPPINGS)) {
        g.Pixabay.MAPPINGS = [];
    }

    /**
     * Mapping for Picture search cache
     */
    g.Pixabay.MAPPINGS.push({
        TYPE: g._config.RECORD_TYPES.SEARCH_CACHE,
        MAPPING: {
            "properties": {
                "url": {
                    "type": "keyword",
                    "fields": {
                        "text": {
                            "type": "text"
                        }
                    }
                },
                "createdDate": {
                    "type": "date"
                },
                "createdBy": {
                    "type": "keyword",
                    "fields": {
                        "text": {
                            "type": "text"
                        }
                    }
                }
            }
        }
    });
})(this);