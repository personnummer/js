/**
 * Calculates the Luhn checksum of a string of digits.
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
 * Test if the input parameters are a valid date or not.
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
  return !('' + date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day);
};

/**
 * Parse a Swedish social security number and get the parts.
 *
 * @param {string|int} ssn
 *
 * @return {object}
 */
const getParts = (ssn) => {
  ssn += '';

  const reg = /^(\d{2}){0,1}(\d{2})(\d{2})(\d{2})([\-|\+]{0,1})?(\d{3})(\d{0,1})$/;
  const match = reg.exec(ssn);

  if (!match) {
    return {};
  }

  let century = match[1];
  let year = match[2];
  let month = match[3];
  let day = match[4];
  let sep = match[5];
  let num = match[6];
  let check = match[7];

  if (sep !== '-' && sep !== '+') {
    if ((typeof century === 'undefined' || !century.length) || (new Date).getFullYear() - parseInt(century + year, 10) < 100) {
      sep = '-';
    } else {
      sep = '+';
    }
  }

  if (typeof century === 'undefined' || !century.length) {
    const d = new Date;
    let baseYear = 0;

    if (sep === '+') {
      baseYear = d.getFullYear() - 100;
    } else {
      baseYear = d.getFullYear();
    }

    century = ('' + (baseYear - ((baseYear - year) % 100))).substr(0, 2);
  }

  return {
    'century': century,
    'year': year,
    'month': month,
    'day': day,
    'sep': sep,
    'num': num,
    'check': check
  };
}

module.exports = {
  /**
   * Format a Swedish social security number as one of the official formats,
   * A long format or a short format.
   *
   * If the input number could not be parsed a empty string will be returned.
   *
   * @param {string} ssn
   * @param {boolean} longFormat
   *
   * @return {string}
   */
  format(ssn, longFormat) {
    if (!this.valid(ssn)) {
      return '';
    }

    const parts = getParts(ssn);

    if (longFormat) {
      return `${parts.century}${parts.year}${parts.month}${parts.day}${parts.num}${parts.check}`;
    }

    return `${parts.year}${parts.month}${parts.day}${parts.sep}${parts.num}${parts.check}`;
  },

  /**
   * Get age from a Swedish social security number.
   *
   * @param {string|int} ssn
   * @param {boolean} includeCoordinationNumber
   *
   * @return {int}
   */
  getAge(ssn, includeCoordinationNumber) {
    if (!this.valid(ssn, includeCoordinationNumber)) {
      return 0;
    }

    const parts = getParts(ssn);
    let day = +parts.day;

    if (includeCoordinationNumber && day >= 61 && day < 91) {
      day -= 60;
    }

    return Math.floor((Date.now() - new Date(parts.century + parts.year, parts.month, day).getTime()) / 3.15576e+10);
  },

  /**
   * Check if a Swedish social security number is for a female.
   *
   * @param {string|number} ssn
   * @param {boolean} includeCoordinationNumber
   *
   * @throws Error when input value is not valid.
   *
   * @return {boolean}
   */
  isFemale(ssn, includeCoordinationNumber) {
    return !this.isMale(ssn, includeCoordinationNumber)
  },

  /**
   * Check if a Swedish social security number is for a male.
   *
   * @param {string|number} ssn
   * @param {boolean} includeCoordinationNumber
   *
   * @throws Error when input value is not valid.
   *
   * @return {boolean}
   */
  isMale(ssn, includeCoordinationNumber) {
    if (!this.valid(ssn, includeCoordinationNumber)) {
      throw new Error('Invalid swedish social security number');
    }

    const parts = getParts(ssn);
    const genderDigit = parts['num'].substr(-1);

    return genderDigit % 2 === 1;
  },

  /**
   * Validate a Swedish social security number.
   *
   * @param {string|number} str
   * @param {boolean} includeCoordinationNumber
   *
   * @return {boolean}
   */
  valid(ssn, includeCoordinationNumber = true) {
    if (typeof ssn !== 'number' && typeof ssn !== 'string') {
      return false;
    }

    const parts = getParts(ssn);
    if (!Object.keys(parts).length) {
      return false;
    }

    const valid = luhn(parts.year + parts.month + parts.day + parts.num) === +parts.check && !!parts.check;

    if (valid && testDate(parts.century + parts.year, +parts.month, +parts.day)) {
      return valid;
    }

    if (!includeCoordinationNumber) {
      return false;
    }

    return valid && testDate(parts.century + parts.year, +parts.month, +parts.day - 60);
  }
};
