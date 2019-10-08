/*
 * Utils library for the Kademi Platform
 * 
 * URL: https://gist.github.com/tuzzmaniandevil/0ef4afdd30631df17155fb784abbe66d
 */

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

    /**
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
     * 
     * @param {type} o
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
     * 
     * @param {type} o
     * @returns {String}
     */
    Utils.replaceYuckyChars = function (o) {
        var s = this.safeString.call(this, o);

        s = s.toLowerCase().replace("/", "");
        s = s.replace(/[^A-Za-z0-9]/g, "-");
        while (s.indexOf("--") > -1) {
            s = s.replace("--", "-");
        }

        if (s.endsWith("-")) {
            s = s.substring(0, s.length - 1);
        }

        return s;
    };

    /**
     * Safe splits a string
     * @param {type} o
     * @param {type} sep
     * @returns {Array}
     */
    Utils.safeArray = function (o, sep) {
        if (this.isStringBlank.call(this, o)) {
            return [];
        }

        if (this.isStringBlank.call(this, sep)) {
            sep = ',';
        }

        return this.safeString.call(this, o).split(sep);
    };

    /**
     * Generates a random string
     * @param {type} maxSize
     * @returns {String}
     */
    Utils.randomString = function (maxSize) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var size = maxSize || 5;

        for (var i = 0; i < size; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    };

    Utils.extend = function () {
        // Variables
        var extended = {};
        var deep = false;
        var i = 0;
        var length = arguments.length;

        // Check if a deep merge
        if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
            deep = arguments[0];
            i++;
        }

        // Merge the object into the extended object
        var merge = function (obj) {
            for (var prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    // If deep merge and property is an object, merge properties
                    if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                        extended[prop] = extend(true, extended[prop], obj[prop]);
                    } else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        };

        // Loop through each object and conduct a merge
        for (; i < length; i++) {
            var obj = arguments[i];
            merge(obj);
        }

        return extended;
    };

    g.Utils = Utils;
})(this);