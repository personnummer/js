import Personnummer from './personnummer';

module.exports = {
  parse(ssn) {
    return new Personnummer(ssn);
  },

  /**
   * Format a Swedish social security number as one of the official formats,
   * A long format or a short format.
   *
   * If the input number could not be parsed a empty string will be returned.
   *
   * @param {string} ssn
   * @param {object} options
   *
   * @return {string}
   */
  format(ssn, options = {}) {
    return this.parse(ssn).format(options);
  },

  /**
   * Get age from a Swedish social security number.
   *
   * @param {string|int} ssn
   * @param {object} options
   *
   * @return {int}
   */
  getAge(ssn, options = {}) {
    return this.parse(ssn).getAge(options);
  },

  /**
   * Check if a Swedish social security number is for a female.
   *
   * @param {string|number} ssn
   * @param {object} options
   *
   * @throws Error when input value is not valid.
   *
   * @return {boolean}
   */
  isFemale(ssn, options = {}) {
    return this.parse(ssn).isFemale(options);
  },

  /**
   * Check if a Swedish social security number is for a male.
   *
   * @param {string|number} ssn
   * @param {object} options
   *
   * @throws Error when input value is not valid.
   *
   * @return {boolean}
   */
  isMale(ssn, options) {
    return this.parse(ssn).isMale(options);
  },

  /**
   * Validate a Swedish social security number.
   *
   * @param {string|number} str
   * @param {object} options
   *
   * @return {boolean}
   */
  valid(ssn, options = {}) {
    return this.parse(ssn).valid(options);
  }
};
