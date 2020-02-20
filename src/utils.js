/**
 * Compare the two dates and return -1, 0 or 1.
 *
 * @param {Date} dateLeft
 * @param {Date} dateRight
 *
 * @return {numbers}
 */
const compareAsc = (dateLeft, dateRight) => {
  const diff = dateLeft.getTime() - dateRight.getTime();
  return diff < 0 ? -1 : diff > 0 ? 1 : diff;
};

/**
 * Get the number of full years between the given dates.
 *
 * @param {Date} dateLeft
 * @param {Date} dateRight
 *
 * @return {numbers}
 */
export const diffInYears = (dateLeft, dateRight) => {
  const sign = compareAsc(dateLeft, dateRight);
  const yearDiff = Math.abs(dateLeft.getFullYear() - dateRight.getFullYear());

  dateLeft.setFullYear(dateLeft.getFullYear() - sign * yearDiff);

  const isLastYearNotFull = compareAsc(dateLeft, dateRight) === -sign;
  const result = sign * (yearDiff - isLastYearNotFull);

  return result === 0 ? 0 : result;
};

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
