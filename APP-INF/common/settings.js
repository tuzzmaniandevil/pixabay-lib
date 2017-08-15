/* global applications */

(function (g) {

    g.pixaBaySaveSettings = function (page, params) {
        page.setAppSetting(g._config.APP_ID, 'pixabayApiKey', params.pixabayApiKey);

        return true;
    };

    g._getPixabayApiKey = function () {
        var app = applications.get(g._config.APP_ID);

        return app.getSetting('pixabayApiKey');
    };

})(this);