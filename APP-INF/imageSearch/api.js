/* global Utils */

(function (g) {
    if (Utils.isNull(g.Pixabay)) {
        g.Pixabay = {};
    }

    g.Pixabay.IMAGE_SEARCH = {
        DEFAULT_CONFIG: {
            q: null,
            lang: 'en',
            id: null,
            response_group: 'image_details',
            image_type: 'all',
            orientation: 'all',
            category: null,
            min_width: 0,
            min_height: 0,
            editors_choice: false,
            safesearch: true,
            order: 'popular',
            page: 1,
            per_page: 20
        }
    };

    g.Pixabay.imageSearch = function (page, config) {
        var searchConfig = g.Pixabay.IMAGE_SEARCH.DEFAULT_CONFIG;

        if (Utils.isNotNull(config)) {
            searchConfig = $.extend({}, g.Pixabay.IMAGE_SEARCH.DEFAULT_CONFIG, config);
        }

        searchConfig.key = g._getPixabayApiKey();

        if (Utils.isStringNotBlank(searchConfig.q)) {
            searchConfig.q = Utils.safeString(searchConfig.q).split(' ').join('+');
        }

        return g._sendRequest(page, 'https://pixabay.com/api/', searchConfig);
    };
})(this);