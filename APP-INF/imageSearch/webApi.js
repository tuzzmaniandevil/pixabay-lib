/* global Utils, controllerMappings, views */

(function (g) {
    var ACCEPTED_PARAMS = ['q', 'lang', 'id', 'image_type', 'response_group',
        'orientation', 'category', 'min_width', 'min_height', 'editors_choice',
        'safesearch', 'order', 'page', 'per_page'];

    controllerMappings
            .adminController()
            .enabled(true)
            .path('/_pixabayImage')
            .addMethod('GET', '_pixabayImageSearch')
            .build();

    controllerMappings
            .adminController()
            .enabled(true)
            .path('/_pixabayFetchImage')
            .addMethod('GET', '_pixabayFetchImage')
            .build();

    controllerMappings
            .adminController()
            .enabled(true)
            .path('/testPixabay')
            .defaultView(views.templateView('/theme/apps/pixabay-lib/testPage.html'))
            .build();

    g._pixabayImageSearch = function (page, params) {
        var config = {};

        for (var key in params) {
            var value = params[key];
            if (ACCEPTED_PARAMS.indexOf(key) >= 0 && Utils.isStringNotBlank(value)) {
                config[key] = value;
            }
        }

        var result = g.Pixabay.imageSearch(page, config);

        return views.textView(JSON.stringify(result), 'application/json');
    };

    g._pixabayFetchImage = function (page, params) {
        var imageId = Utils.safeString(params.get('id'));
        var size = Utils.safeString(params.get('size'));

        var result = g.Pixabay.fetchImage(page, imageId, size);

        return views.textView(JSON.stringify(result), 'application/json');
    };
})(this);