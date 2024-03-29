/**
 * @typedef {Object} MoleculerContext
 * @property {Function} call Moleculer call function
 * @property {Object} db Object with models specified in LeemonsMongoDBMixin.models
 * @property {Object} tx All shares below tx have Leemons Transactions
 * @property {Function} tx.call Moleculer call function using Leemons Transactions
 * @property {Object} tx.db Object with models specified in LeemonsMongoDBMixin.models using Leemons Transactions
 */

/**
 * @typedef {string} LocaleCode a string with the format (xx or xx-yy)
 *
 * @typedef {string} LocaleName a string with 1 <= length <= 25
 *
 * @typedef Locale
 * @property {LocaleCode} code
 * @property {LocaleName} name
 * @property {number | undefined} [id] The locale internal id
 */

/**
 * @typedef {string} LocalizationKey a string with the format (xx.yy.bb1_-)
 *
 * @typedef {string} LocalizationValue a string with 1 <= length <= 65535
 *
 * @typedef Localization
 * @property {LocaleCode} locale
 * @property {LocalizationKey} key
 * @property {LocalizationValue} value
 * @property {number | undefined} [id] The locale internal id
 */
