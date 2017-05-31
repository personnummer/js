/**
* is-personnummer
* https://github.com/frozzare/is-personnummer
*
* Copyright (c) 2014 Fredrik Forsmo
* Licensed under the MIT license.
*/

'use strict';

/**
* Export the module for AMD, Browser and Node.
*/

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else {
        root.isPersonnummer = factory();
    }
}(this, function () {
    /**
    * The Luhn algorithm.
    *
    * @param {string|number} str
    *
    * @return {number}
    */

    function luhn(str) {
        var d = 0,
            e = false; // e = even = n-th digit counted from the end

        return (str.split('').reverse().reduce(
            function(s, dstr){
                d = parseInt(dstr); // reduce arg 0 - callback function
                return (s + ((e = !e) ? d : [0, 2, 4, 6, 8, 1, 3, 5, 7, 9][d]));
            }, 0 // reduce arg 1 - prev value for first iteration (sum)
        ) % 10 == 0);
    }

    /**
    * Test date if lunh is true.
    *
    * @param {int} year
    * @param {int} month
    * @param {int} day
    *
    * @return {boolean}
    */

    function testDate (year, month, day) {
        month -= 1;
        var date = new Date(year, month, day);
        return !(date.getYear() !== year || date.getMonth() !== month || date.getDate() !== day);
    }


    /**
    * Validate Swedish personal identity numbers.
    *
    * @param {string|number} str
    *
    * @return {boolean}
    */

    return function (str) {
        if (typeof str !== 'number' && typeof str !== 'string') {
            return false;
        }

        str += '';

        var reg = /^(\d{2}){0,1}(\d{2})(\d{2})(\d{2})([\-|\+]{0,1})?(\d{3})(\d{0,1})$/;
        var match = reg.exec(str);

        if (!match) {
            return false;
        }

        var year = match[2];
        var month = match[3];
        var day = match[4];
        var sep = match[5];
        var num = match[6];
        var check = match[7];

        if (sep === undefined) {
            sep = '-';
        }

        if (year.length === 4) {
            year = year.substr(2);
        }

        var valid = luhn(year + month + day + num + check);

        if (valid && testDate(+year, +month, +day)) {
            return valid;
        }

        return valid && testDate(+year, +month, +day - 60);
    };
}));
