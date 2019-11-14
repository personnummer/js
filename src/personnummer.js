import { PersonnummerError } from './errors';
import { luhn, testDate } from './utils';

class Personnummer {
  /**
   * Default options.
   *
   * @var {object}
   */
  #defaultOptions = {
    coordinationNumber: true,
    longFormat: false
  }

  year = null;
  month = null;
  day = null;
  controlNumbers = null;

  /**
   * Personnummer constructor.
   *
   * @param {numbers|string} ssn
   */
  constructor(ssn) {
    this.#parse(ssn)
  }

  /**
   * Parse personnummer and set class properties.
   *
   * @param {numbers|string} ssn
   */
  #parse (ssn) {
    ssn += '';

    const reg = /^(\d{2}){0,1}(\d{2})(\d{2})(\d{2})([\-|\+]{0,1})?(\d{3})(\d{0,1})$/;
    const match = reg.exec(ssn);

    if (!match) {
      return;
    }

    let century = match[1];
    let year = match[2];
    let month = match[3];
    let day = match[4];
    let sep = match[5];
    let num = match[6];
    let check = match[7];

    if (typeof century === 'undefined' || !century.length) {
      const d = new Date;
      let baseYear = 0;

      if (sep === '+') {
        baseYear = d.getFullYear() - 100;
      } else {
        sep = '-';
        baseYear = d.getFullYear();
      }

      century = ('' + (baseYear - ((baseYear - year) % 100))).substr(0, 2);
    } else {
      if ((new Date().getFullYear()) - parseInt(century + year, 10) < 100) {
        sep = '-';
      } else {
        sep = '+';
      }
    }

    this.century = century;
    this.year = year;
    this.month = month;
    this.day = day;
    this.sep = sep;
    this.num = num;
    this.check = check;
  }

  /**
   * Format a Swedish social security number as one of the official formats,
   * A long format or a short format.
   *
   * If the input number could not be parsed a empty string will be returned.
   *
   * @param {object} options
   *
   * @return {string}
   */
  format(options = {}) {
    if (!this.valid(options)) {
      throw new PersonnummerError;
    }

    options = Object.assign({}, this.#defaultOptions, options);

    if (options.longFormat) {
      return `${this.century}${this.year}${this.month}${this.day}${this.num}${this.check}`;
    }

    return `${this.year}${this.month}${this.day}${this.sep}${this.num}${this.check}`;
  }

  /**
   * Get age from a Swedish social security number.
   *
   * @param {object} options
   *
   * @return {int}
   */
  getAge(options = {}) {
    if (!this.valid(options)) {
      throw new PersonnummerError;
    }

    let day = +this.day;

    // todo move?
    if (day >= 61 && day < 91) {
      day -= 60;
    }

    return Math.floor((Date.now() - new Date(this.century + this.year, this.month, day).getTime()) / 3.15576e+10);
  }

  /**
   * Check if a Swedish social security number is for a female.
   *
   * @param {object} options
   *
   * @throws Error when input value is not valid.
   *
   * @return {boolean}
   */
  isFemale(options = {}) {
    return !this.isMale(options)
  }

  /**
   * Check if a Swedish social security number is for a male.
   *
   * @param {object} options
   *
   * @throws Error when input value is not valid.
   *
   * @return {boolean}
   */
  isMale(options) {
    if (!this.valid(options)) {
      throw new PersonnummerError;
    }

    const sexDigit = this.num.substr(-1);

    return sexDigit % 2 === 1;
  }

  /**
   * Validate a Swedish social security number.
   *
   * @param {object} options
   *
   * @return {boolean}
   */
  valid(options) {
    options = Object.assign({}, this.#defaultOptions, options)

    const valid = luhn(this.year + this.month + this.day + this.num) === +this.check && !!this.check;

    if (valid && testDate(this.century + this.year, +this.month, +this.day)) {
      return valid;
    }

    if (!options.coordinationNumber) {
      return false;
    }

    return valid && testDate(this.century + this.year, +this.month, (+this.day) - 60);
  }
}

export default Personnummer;
