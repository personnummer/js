/**
 * The Luhn algorithm.
 *
 * @param {string|number} str
 *
 * @return {number}
 */
const luhn = str => {
  let v = 0;
  let sum = 0;

  str += '';

  for (var i = 0, l = str.length; i < l; i++) {
    v = str[i];
    v *= 2 - i % 2;
    if (v > 9) {
      v -= 9;
    }
    sum += v;
  }

  return Math.ceil(sum / 10) * 10 - sum;
};

/**
 * Test date if lunh is true.
 *
 * @param {int} year
 * @param {int} month
 * @param {int} day
 *
 * @return {boolean}
 */
const testDate = (year, month, day) => {
  month -= 1;
  const date = new Date(year, month, day);
  return !(date.getYear() !== year || date.getMonth() !== month || date.getDate() !== day);
};

/**
 * Validate Swedish social security numbers.
 *
 * @param {string|number} str
 * @param {boolean} includeCoordinationNumber
 *
 * @return {boolean}
 */
module.exports.valid = (str, includeCoordinationNumber) => {
  if (typeof str !== 'number' && typeof str !== 'string') {
    return false;
  }

  if (typeof includeCoordinationNumber === 'undefined') {
    includeCoordinationNumber = true;
  }

  str += '';

  const reg = /^(\d{2}){0,1}(\d{2})(\d{2})(\d{2})([\-|\+]{0,1})?(\d{3})(\d{0,1})$/;
  const match = reg.exec(str);

  if (!match) {
    return false;
  }

  let century = match[1];
  let year = match[2];
  let month = match[3];
  let day = match[4];
  let sep = match[5];
  let num = match[6];
  let check = match[7];

  if (sep === undefined) {
    sep = '-';
  }

  const valid = luhn(year + month + day + num) === +check && !!check;

  if (valid && testDate(+year, +month, +day)) {
    return valid;
  }

  if (!includeCoordinationNumber) {
    return false;
  }

  return valid && testDate(+year, +month, +day - 60);
};
