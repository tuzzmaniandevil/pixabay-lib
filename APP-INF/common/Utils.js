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

    g.Utils = Utils;
})(this);
