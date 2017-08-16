/* global Utils, controllerMappings, views */

(function (g) {
    var ACCEPTED_PARAMS = ['q', 'lang', 'id', 'response_group', 'image_type',
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
})(this);