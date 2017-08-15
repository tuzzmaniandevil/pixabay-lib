/* global Utils */

(function (g) {

    if (Utils.isNull(g.Pixabay)) {
        g.Pixabay = {};
    }

    g.Pixabay.LOGO = function (name, url) {
        this.name = name;
        this.url = url;

        this.getUrl = function () {
            return url;
        };

        this.getName = function () {
            return name;
        };

        this.getHtml = function () {
            return '<a href="https://pixabay.com/"><img src="' + this.url + '" alt="Pixabay"></a>';
        };
    };

    g.Pixabay.LOGOS = {
        DEFAULT: new g.Pixabay.LOGO('Standard', 'https://pixabay.com/static/img/logo.svg'),
        SQUARE: new g.Pixabay.LOGO('Square', 'https://pixabay.com/static/img/logo_square.svg'),
        MEDIUM_RECTANGLE: new g.Pixabay.LOGO('Medium Rectangle', 'https://pixabay.com/static/img/public/medium_rectangle_a.png'),
        MEDIUM_RECTANGLE_GREEN: new g.Pixabay.LOGO('Medium Rectangle Green', 'https://pixabay.com/static/img/public/medium_rectangle_b.png'),
        LEADERBOARD: new g.Pixabay.LOGO('Leaderboard', 'https://pixabay.com/static/img/public/leaderboard_a.png'),
        LEADERBOARD_GREEN: new g.Pixabay.LOGO('Leaderboard Green', 'https://pixabay.com/static/img/public/leaderboard_b.png')
    };

})(this);