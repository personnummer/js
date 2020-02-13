import { PersonnummerError } from './errors';
import { diffInYears, luhn, testDate } from './utils';

class Personnummer {

  /**
   * Personnummer age.
   *
   * @var {string}
   */
  age = '';

  /**
   * Personnummer century.
   *
   * @var {string}
   */
  century = '';

  /**
   * Personnummer full year.
   *
   * @var {string}
   */
  fullYear = '';

  /**
   * Personnummer year.
   *
   * @var {string}
   */
  year = '';

  /**
   * Personnummer month.
   *
   * @var {string}
   */
  month = '';

  /**
   * Personnummer day.
   *
   * @var {string}
   */
  day = '';

  /**
   * Personnummer seperator.
   *
   * @var {string}
   */
  sep = '';

  /**
   * Personnumer first three of the last four numbers.
   *
   * @var {string}
   */
  num = '';

  /**
   * The last number of the personnummer.
   *
   * @var {string}
   */
  check = '';

  /**
   * Personnummer constructor.
   *
   * @param {string} ssn
   * @param {object} options
   */
  constructor(ssn, options = {}) {
    this.#parse(ssn, options);
  }

  /**
   * Parse personnummer.
   *
   * @param {string} ssn
   * @param {object} options
   *
   * @return {Personnummer}
   */
  static parse(ssn, options = {}) {
    return new Personnummer(ssn, options);
  }

  /**
   * Parse personnummer and set class properties.
   *
   * @param {string} ssn
   * @param {object} options
   */
  #parse (ssn, options = {}) {
    if (typeof ssn !== 'string') {
      throw new PersonnummerError();
    }

    const reg = /^(\d{2}){0,1}(\d{2})(\d{2})(\d{2})([\-|\+]{0,1})?(\d{3})(\d{0,1})$/;
    const match = reg.exec(ssn);

    if (!match) {
      throw new PersonnummerError();
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
    this.fullYear = century + year;
    this.month = month;
    this.day = day;
    this.sep = sep;
    this.num = num;
    this.check = check;

    let ageDay = +this.day;
    if (ageDay >= 61 && ageDay < 91) {
      ageDay -= 60;
    }

    const ageDate = this.century + this.year + '-' + this.month + '-' + ageDay;
    this.age = '' + diffInYears(new Date(Date.now()), new Date(ageDate));

    if (!this.#valid()) {
      throw new PersonnummerError();
    }
  }

  /**
   * Validate a Swedish social security number.
   *
   * @return {boolean}
   */
  #valid() {
    const valid = luhn(this.year + this.month + this.day + this.num) === +this.check && !!this.check;

    if (valid && testDate(this.century + this.year, +this.month, +this.day)) {
      return valid;
    }

    return valid && testDate(this.century + this.year, +this.month, (+this.day) - 60);
  }

  /**
   * Format a Swedish social security number as one of the official formats,
   * A long format or a short format.
   *
   * If the input number could not be parsed a empty string will be returned.
   *
   * @param {boolean} longFormat
   *
   * @throws Error when input value is not valid.
   *
   * @return {string}
   */
  format(longFormat = false) {
    if (longFormat) {
      return `${this.century}${this.year}${this.month}${this.day}${this.num}${this.check}`;
    }

    return `${this.year}${this.month}${this.day}${this.sep}${this.num}${this.check}`;
  }

  /**
   * Check if a Swedish social security number is a coordination number or not.
   *
   * @return {boolean}
   */
  isCoordinationNumber() {
    const day = +this.day
    return day >= 61 && day < 91
  }

  /**
   * Check if a Swedish social security number is for a female.
   *
   * @throws Error when input value is not valid.
   *
   * @return {boolean}
   */
  isFemale() {
    return !this.isMale()
  }

  /**
   * Check if a Swedish social security number is for a male.
   *
   * @throws Error when input value is not valid.
   *
   * @return {boolean}
   */
  isMale() {
    const sexDigit = this.num.substr(-1);

    return sexDigit % 2 === 1;
  }
}

export default Personnummer;
