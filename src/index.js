import Personnummer from './personnummer';

/**
 * Parse personnummer.
 * 
 * @param {string} ssn 
 */
const parse = (ssn, options) => new Personnummer(ssn, options);

/**
 * Validate a Swedish social security number.
 *
 * @param {string|number} str
 * @param {object} options
 *
 * @return {boolean}
 */
const valid = (ssn, options) => parse(ssn, options).isValid();

export default {
  Personnummer,
  parse,
  valid,
};