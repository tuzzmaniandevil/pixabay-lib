(function (g) {

    function config() {
        var _self = this;

        _self.APP_ID = 'pixabay-lib';
        _self.DB_NAME = _self.APP_ID + '_db';
        _self.DB_TITLE = 'Pixabay Cache DB';

        _self.RECORD_NAMES = {
            SEARCH_CACHE: function (hash) {
                return 'search_cache_' + hash;
            }
        };

        _self.RECORD_TYPES = {
            SEARCH_CACHE: 'SEARCH_CACHE'
        };
    }

    g._config = new config();

})(this);