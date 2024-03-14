/**
 * Compare the two dates and return -1, 0 or 1.
 *
 * @param {Date} dateLeft
 * @param {Date} dateRight
 *
 * @return {number}
 */
const compareAsc = (dateLeft: Date, dateRight: Date): number => {
  const diff = dateLeft.getTime() - dateRight.getTime();
  return diff < 0 ? -1 : diff > 0 ? 1 : diff;
};

/**
 * Get the number of full years between the given dates.
 *
 * @param {Date} dateLeft
 * @param {Date} dateRight
 *
 * @return {number}
 */
export const diffInYears = (dateLeft: Date, dateRight: Date): number => {
  const sign = compareAsc(dateLeft, dateRight);
  const yearDiff = Math.abs(dateLeft.getFullYear() - dateRight.getFullYear());

  dateLeft.setFullYear(dateLeft.getFullYear() - sign * yearDiff);

  const isLastYearNotFull = compareAsc(dateLeft, dateRight) === -sign;
  const result = sign * (yearDiff - +isLastYearNotFull);

  return result === 0 ? 0 : result;
};

/**
 * Calculates the Luhn checksum of a string of digits.
 *
 * @param {string|number} str
 *
 * @return {number}
 */
export const luhn = (str: string): number => {
  let sum = 0;

  str += '';

  for (let i = 0, l = str.length; i < l; i++) {
    let v = parseInt(str[i]);
    v *= 2 - (i % 2);
    if (v > 9) {
      v -= 9;
    }
    sum += v;
  }

  return Math.ceil(sum / 10) * 10 - sum || 0;
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
export const testDate = (year: number, month: number, day: number): boolean => {
  month -= 1;
  const date = new Date(year, month, day);
  return !(
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  );
};
