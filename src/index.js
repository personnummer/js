import Personnummer from './personnummer';

export const parse = ssn => new Personnummer(ssn);

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
export const format = (ssn, options) => parse(ssn).format(options);

/**
 * Get age from a Swedish social security number.
 *
 * @param {string|int} ssn
 * @param {object} options
 *
 * @return {int}
 */
export const getAge = (ssn, options) => parse(ssn).getAge(options);

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
export const isFemale = (ssn, options) => parse(ssn).isFemale(options);

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
export const isMale = (ssn, options) => parse(ssn).isMale(options);

/**
 * Validate a Swedish social security number.
 *
 * @param {string|number} str
 * @param {object} options
 *
 * @return {boolean}
 */
export const valid = (ssn, options) => parse(ssn).valid(options);

export default {
  format,
  getAge,
  isFemale,
  isMale,
  parse,
  valid,
}
