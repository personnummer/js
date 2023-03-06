import { PersonnummerError } from './errors';
import { diffInYears, luhn, testDate } from './utils';

type OptionsType = {
  allowCoordinationNumber: boolean;
  allowInterimNumber: boolean;
};

class Personnummer {
  /**
   * Options.
   *
   * @var {OptionsType}
   */
  private _options: OptionsType;

  /**
   * Personnummer century.
   *
   * @var {string}
   */
  private _century = '';

  /**
   * Get century.
   *
   * @return {string}
   */
  get century(): string {
    return this._century;
  }

  /**
   * Personnummer full year.
   *
   * @var {string}
   */
  private _fullYear = '';

  /**
   * Get age.
   *
   * @return {string}
   */
  get fullYear(): string {
    return this._fullYear;
  }

  /**
   * Personnummer year.
   *
   * @var {string}
   */
  private _year = '';

  /**
   * Get age.
   *
   * @return {string}
   */
  get year(): string {
    return this._year;
  }

  /**
   * Personnummer month.
   *
   * @var {string}
   */
  private _month = '';

  /**
   * Get month.
   *
   * @return {string}
   */
  get month(): string {
    return this._month;
  }

  /**
   * Personnummer day.
   *
   * @var {string}
   */
  private _day = '';

  /**
   * Get day.
   *
   * @return {string}
   */
  get day(): string {
    return this._day;
  }

  /**
   * Personnummer seperator.
   *
   * @var {string}
   */
  private _sep = '';

  /**
   * Get sep.
   *
   * @return {string}
   */
  get sep(): string {
    return this._sep;
  }

  /**
   * Personnumer first three of the last four numbers.
   *
   * @var {string}
   */
  private _num = '';

  /**
   * Get num.
   *
   * @return {string}
   */
  get num(): string {
    return this._num;
  }

  /**
   * The last number of the personnummer.
   *
   * @var {string}
   */
  private _check = '';

  /**
   * Get check.
   *
   * @return {string}
   */
  get check(): string {
    return this._check;
  }

  /**
   * Personnummer constructor.
   *
   * @param {string} pin
   * @param {object} options
   */
  constructor(pin: string, options?: OptionsType) {
    this.parse(pin, {
      allowCoordinationNumber: true,
      allowInterimNumber: false,
      ...options,
    });
  }

  /**
   * Parse personnummer.
   *
   * @param {string} pin
   * @param {object} options
   *
   * @return {Personnummer}
   */
  static parse(pin: string, options?: OptionsType): Personnummer {
    return new Personnummer(pin, options);
  }

  /**
   * Validate a Swedish personal identity number.
   *
   * @param {string} str
   * @param {object} options
   *
   * @return {boolean}
   */
  static valid(pin: string, options?: OptionsType): boolean {
    try {
      Personnummer.parse(pin, options);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Parse personnummer and set class properties.
   *
   * @param {string} pin
   * @param {object} options
   */
  // eslint-disable-next-line
  private parse(pin: string, options?: OptionsType) {
    const reg =
      /^(\d{2}){0,1}(\d{2})(\d{2})(\d{2})([+-]?)((?!000)\d{3}|[PTRSUWXJKLMN]\d{2})(\d)$/;

    const match = reg.exec(pin);

    if (!match) {
      throw new PersonnummerError();
    }

    const century = match[1];
    const year = match[2];
    const month = match[3];
    const day = match[4];
    const sep = match[5];
    const num = match[6];
    const check = match[7];

    if (typeof century === 'undefined' || !century.length) {
      const d = new Date();
      let baseYear = 0;

      if (sep === '+') {
        this._sep = '+';
        baseYear = d.getFullYear() - 100;
      } else {
        this._sep = '-';
        baseYear = d.getFullYear();
      }

      this._century = (
        '' +
        (baseYear - ((baseYear - parseInt(year)) % 100))
      ).substr(0, 2);
    } else {
      this._century = century;

      if (new Date().getFullYear() - parseInt(century + year, 10) < 100) {
        this._sep = '-';
      } else {
        this._sep = '+';
      }
    }

    this._year = year;
    this._fullYear = this._century + year;
    this._month = month;
    this._day = day;
    this._num = num;
    this._check = check;

    if (!this.valid()) {
      throw new PersonnummerError();
    }

    // throw error if allow coordination numbers is not allowed.
    if (!options?.allowCoordinationNumber && this.isCoordinationNumber()) {
      throw new PersonnummerError();
    }

    // throw error if allow interim numbers is not allowed.
    if (!options?.allowInterimNumber && this.isInterimNumber()) {
      throw new PersonnummerError();
    }
  }

  /**
   * Validate a Swedish personal identity number.
   *
   * @return {boolean}
   */
  private valid(): boolean {
    const valid =
      luhn(
        this.year + this.month + this.day + this.num.replace(/[A-Z]/, '1')
      ) === +this.check && !!this.check;

    if (
      valid &&
      testDate(parseInt(this.century + this.year), +this.month, +this.day)
    ) {
      return valid;
    }

    return (
      valid &&
      testDate(parseInt(this.century + this.year), +this.month, +this.day - 60)
    );
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
  format(longFormat = false): string {
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
  getAge(): number {
    const date = this.getDate();
    return diffInYears(new Date(Date.now()), date);
  }

  /**
   * Get date from a Swedish personal identity number.
   *
   * @return {Date}
   */
  getDate(): Date {
    let ageDay = +this.day;
    if (this.isCoordinationNumber()) {
      ageDay -= 60;
    }

    const ageDate =
      this.century +
      this.year +
      '-' +
      this.month +
      '-' +
      (ageDay < 10 ? '0' + ageDay : ageDay);

    return new Date(ageDate);
  }

  /**
   * Check if a Swedish personal identity number is a interim number or not.
   *
   * @return {boolean}
   */
  isInterimNumber(): boolean {
    return /[PTRSUWXJKLMN]/.test(this.num[0]);
  }

  /**
   * Check if a Swedish personal identity number is a coordination number or not.
   *
   * @return {boolean}
   */
  isCoordinationNumber(): boolean {
    return testDate(
      parseInt(this.century + this.year),
      +this.month,
      +this.day - 60
    );
  }

  /**
   * Check if a Swedish personal identity number is for a female.
   *
   * @return {boolean}
   */
  isFemale(): boolean {
    return !this.isMale();
  }

  /**
   * Check if a Swedish personal identity number is for a male.
   *
   * @return {boolean}
   */
  isMale(): boolean {
    const sexDigit = parseInt(this.num.substr(-1));

    return sexDigit % 2 === 1;
  }
}

export default Personnummer;
