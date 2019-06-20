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
  function luhn (str) {
    var v   = 0;
    var sum = 0;

    str += '';

    for (var i = 0, l = str.length; i < l; i++) {
      v = str[i];
      v *= 2 - (i % 2);
      if (v > 9) {
        v -= 9;
      }
      sum += v;
    }

    return Math.ceil(sum / 10) * 10 - sum;
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
   * Validate Swedish social security numbers.
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

    var reg     = /^(\d{2}){0,1}(\d{2})(\d{2})(\d{2})([\-|\+]{0,1})?(\d{3})(\d{0,1})$/;
    var match   = reg.exec(str);

    if (!match) {
      return false;
    }

    var century = match[1];
    var year    = match[2];
    var month   = match[3];
    var day     = match[4];
    var sep     = match[5];
    var num     = match[6];
    var check   = match[7];

    if (sep === undefined) {
      sep = '-';
    }

    var valid = luhn(year + month + day + num) === +check && !!check;

    if (valid && testDate(+year, +month, +day)) {
      return valid;
    }

    return valid && testDate(+year, +month, +day - 60);
  }

}));
