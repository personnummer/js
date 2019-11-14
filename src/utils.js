/**
 * Calculates the Luhn checksum of a string of digits.
 *
 * @param {string|number} str
 *
 * @return {number}
 */
export const luhn = str => {
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
 * Test if the input parameters are a valid date or not.
 *
 * @param {int} year
 * @param {int} month
 * @param {int} day
 *
 * @return {boolean}
 */
export const testDate = (year, month, day) => {
  month -= 1;
  const date = new Date(year, month, day);
  return !('' + date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day);
};
