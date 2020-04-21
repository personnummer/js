import { PersonnummerError } from './errors';
import { diffInYears, luhn, testDate } from './utils';

class Personnummer {

  /**
   * Personnummer century.
   *
   * @var {string}
   */
  #century = '';

  /**
   * Get century.
   *
   * @return {string}
   */
  get century() {
    return this.#century
  }

  /**
   * Personnummer full year.
   *
   * @var {string}
   */
  #fullYear = '';

  /**
   * Get age.
   *
   * @return {string}
   */
  get fullYear() {
    return this.#fullYear
  }

  /**
   * Personnummer year.
   *
   * @var {string}
   */
  #year = '';

  /**
   * Get age.
   *
   * @return {string}
   */
  get year() {
    return this.#year
  }

  /**
   * Personnummer month.
   *
   * @var {string}
   */
  #month = '';

  /**
   * Get month.
   *
   * @return {string}
   */
  get month() {
    return this.#month
  }

  /**
   * Personnummer day.
   *
   * @var {string}
   */
  #day = '';

  /**
   * Get day.
   *
   * @return {string}
   */
  get day() {
    return this.#day
  }

  /**
   * Personnummer seperator.
   *
   * @var {string}
   */
  #sep = '';

  /**
   * Get sep.
   *
   * @return {string}
   */
  get sep() {
    return this.#sep
  }

  /**
   * Personnumer first three of the last four numbers.
   *
   * @var {string}
   */
  #num = '';

  /**
   * Get num.
   *
   * @return {string}
   */
  get num() {
    return this.#num
  }

  /**
   * The last number of the personnummer.
   *
   * @var {string}
   */
  #check = '';

  /**
   * Get check.
   *
   * @return {string}
   */
  get check() {
    return this.#check
  }

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
   * Validate a Swedish personal identity number.
   *
   * @param {string} str
   * @param {object} options
   *
   * @return {boolean}
   */
  static valid(ssn, options) {
    try {
      Personnummer.parse(ssn, options);
      return true;
    } catch (e) {
      return false;
    }
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

    this.#century = century;
    this.#year = year;
    this.#fullYear = century + year;
    this.#month = month;
    this.#day = day;
    this.#sep = sep;
    this.#num = num;
    this.#check = check;

    if (!this.#valid()) {
      throw new PersonnummerError();
    }
  }

  /**
   * Validate a Swedish personal identity number.
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
   * Format a Swedish personal identity number as one of the official formats,
   * A long format or a short format.
   *
   * If the input number could not be parsed a empty string will be returned.
   *
   * @param {boolean} longFormat
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
   * Get age from a Swedish personal identity number.
   *
   * @return {number}
   */
  getAge() {
    let ageDay = +this.day;
    if (this.isCoordinationNumber()) {
      ageDay -= 60;
    }

    const ageDate = this.century + this.year + '-' + this.month + '-' + ageDay;
    return diffInYears(new Date(Date.now()), new Date(ageDate));
  }

  /**
   * Check if a Swedish personal identity number is a coordination number or not.
   *
   * @return {boolean}
   */
  isCoordinationNumber() {
    return testDate(this.century + this.year, +this.month, (+this.day) - 60);
  }

  /**
   * Check if a Swedish personal identity number is for a female.
   *
   * @return {boolean}
   */
  isFemale() {
    return !this.isMale()
  }

  /**
   * Check if a Swedish personal identity number is for a male.
   *
   * @return {boolean}
   */
  isMale() {
    const sexDigit = this.num.substr(-1);

    return sexDigit % 2 === 1;
  }
}

export default Personnummer;
