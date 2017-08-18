(function (g) {
    var Utils = {};

    /**
     * Checks to see if an object is null or is type of 'undefined'
     *
     * @param {Object} o
     * @returns {Boolean}
     */
    Utils.isNull = function (o) {
        return !this.isNotNull.call(this, o);
    };

    /**
     * Checks to see if an object is not null and is not of type 'undefined'
     *
     * @param {Object} o
     * @returns {Boolean}
     */
    Utils.isNotNull = function (o) {
        return o !== null && typeof o !== 'undefined';
    };

    /**
     * Checks to see if the string is not blank
     *
     * @param {Object} o
     * @returns {Boolean}
     */
    Utils.isStringNotBlank = function (o) {
        return !this.isStringBlank.call(this, o);
    };

    /**
     * Checks to see if the string is blank
     *
     * @param {Object} o
     * @returns {Boolean}
     */
    Utils.isStringBlank = function (o) {
        var s = this.safeString.call(this, o);
        return s.length < 1;
    };

    /**
     *  Makes sure a valid string is returned
     *
     * @param {Object} o
     * @returns {String}
     */
    Utils.safeString = function (o) {
        log.info('safeString: {}', o, typeof o);
        if (o === null || typeof o === 'undefined') {
            return '';
        }

        return o.toString().trim();
    };

    /**
     * Safely converts the given value to an integer
     *
     * @param {type} o
     * @returns {Number}
     */
    Utils.safeInt = function (o) {
        if (this.isNull.call(this, o)) {
            return 0;
        } else if (typeof o === 'number') {
            return o;
        } else {
            var s = this.safeString.call(this, o);
            var i = parseInt(s, 10);
            if (isNaN(i)) {
                return 0;
            } else {
                return i;
            }

        }
    };

    /**
     * Safely converts the given value to a float
     * 
     * @param {type} o
     * @returns {Number}
     */
    Utils.safeFloat = function (o) {
        if (this.isNull.call(this, o)) {
            return 0;
        } else if (typeof o === 'number') {
            return o;
        } else {
            var s = this.safeString.call(this, o);
            var i = parseFloat(s, 10);
            if (isNaN(i)) {
                return 0;
            } else {
                return i;
            }

        }
    };

    /**
     * Safely converts the given value to a boolean
     * 
     * @param {Object} o
     * @returns {Boolean}
     */
    Utils.safeBool = function (o) {
        if (this.isNull.call(this, o)) {
            return false;
        } else if (typeof o === 'boolean') {
            return o;
        } else {
            var s = this.safeString.call(this, o).toLowerCase();
            return s === 'true' || s === 'yes';
        }
    };

    /**
     * Generates a random string with the specified length, Default is 8 characters
     * 
     * @param {Number} length
     * @returns {String}
     */
    Utils.generateRandomText = function (length) {
        length = length || 8;
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var text = "";

        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    };

    /**
     * Get the extention of a file
     * 
     * @param {type} o
     * @returns {unresolved}
     */
    Utils.getFileExt = function (o) {
        var filename = this.safeString.call(this, o);
        return filename.split('.').pop();
    };

    g.Utils = Utils;
})(this);
