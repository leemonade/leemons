const { LeemonsValidator } = global.utils;

// According to MDN: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang#language_tag_syntax
// REQUIRED 2-3 letters defines the basic language
const languageSubtag = '([a-z]{2,3})';
// OPTIONAL 4 letters defines the writing system
const scriptSubtag = '(-[a-z]{4}){0,1}';
// OPTIONAL 2 letters or 3 numbers define the dialect
const regionSubtag = '(-([a-z]{2}|[0-9]{3})){0,1}';

const localeRegexString = `^${languageSubtag}${scriptSubtag}${regionSubtag}$`;
const localeRegex = new RegExp(localeRegexString);
LeemonsValidator.ajv.addFormat('localeCode', {
  validate: (x) => localeRegex.test(x),
});

/**
 * String with format localeCode (xx or xx-yy)
 */
const codeSchema = {
  type: 'string',
  format: 'localeCode',
  minLength: 2,
  maxLength: 12,
};
/**
 * An array of strings with the localeCode format (xx or xx-yy)
 */
const codeArraySchema = {
  type: 'array',
  items: codeSchema,
};

/**
 * A string with 1 <= length <= 255
 */
const nameSchema = {
  type: 'string',
  minLength: 1,
  maxLength: 255,
};

/**
 * An object with the properties:
 *   @property code a string with the format localeCode (xx or xx-yy)
 *   @property name: a string with 1 <= length <= 25
 */
const localesSchema = {
  type: 'object',
  properties: {
    code: codeSchema,
    name: nameSchema,
  },
  required: ['code', 'name'],
};

/**
 * An array of arrays. The inner arrays have 2 items:
 *   @property 0: a string with the format localeCode (xx or xx-yy)
 *   @property 1: a string with 1 <= length <= 25
 */
const arrayLocalesArraySchema = {
  type: 'array',
  items: {
    type: 'array',
    items: [
      {
        type: 'string',
        minLength: 2,
        maxLength: 12,
      },
      nameSchema,
    ],
    minItems: 2,
    maxItems: 2,
  },
};

/**
 * An array of locales objects, these have the properties:
 *   @property code: a string with the format localeCode (xx or xx-yy)
 *   @property name: a string with 1 <= length <= 25
 */
const arrayLocalesSchema = {
  type: 'array',
  items: localesSchema,
};

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
 * Validates a locale code and returns it in lowercase
 * @param {LocaleCode} code
 * @returns {LocaleCode} The code lowercased
 */
function validateLocaleCode(code) {
  // Always save locale in lowercase
  const _code = typeof code === 'string' ? code.toLowerCase() : null;

  const validator = new LeemonsValidator(codeSchema);

  // Throw validation error
  if (!validator.validate(_code)) {
    throw validator.error;
  }

  return _code;
}

/**
 * Validates a locale code and returns wheter is valid or not
 * @param {LocaleCode} code
 * @returns {boolean} If the locale is valid
 */
function isValidLocaleCode(code) {
  try {
    validateLocaleCode(code);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Validates an array of locale codes and returns them in lowercase
 * @param {LocaleCode[]} codes
 * @returns {LocaleCode[]} The codes lowercased
 */
function validateLocaleCodeArray(codes) {
  // Lowercase the codes if is an array, else set _codes to null
  const _codes = Array.isArray(codes) ? codes.map((code) => code.toLowerCase()) : null;

  const validator = new LeemonsValidator(codeArraySchema);

  // Throw validation error
  if (!validator.validate(_codes)) {
    throw validator.error;
  }

  return _codes;
}

/**
 * Validates a locale an returns it lowercased
 * @param {Locale}
 * @returns {Locale}
 */
function validateLocale({ code, name }) {
  // Always save locale in lowercase
  const _code = typeof code === 'string' ? code.toLowerCase() : null;

  const validator = new LeemonsValidator(localesSchema);

  // Throw validation error
  if (!validator.validate({ code: _code, name })) {
    throw validator.error;
  }

  return { code: _code, name };
}

/**
 * Validates an array of arrays, the last one, has the items code and name
 * @param {Array<Array<LocaleCode, LocaleName>>} locales
 * @returns {Locale[]}
 */
function validateLocalesArray(locales) {
  // We need to validate firstly the locales schema for the formatting
  const paramsValidator = new LeemonsValidator(arrayLocalesArraySchema);

  // Throw validation error
  if (!paramsValidator.validate(locales)) {
    throw paramsValidator.error;
  }
  // Get the locales with the code lower cased
  const _locales = locales.map(([code, name]) => ({
    code: code.toLowerCase(),
    name,
  }));

  // Validate the formatted output
  const formatValidator = new LeemonsValidator(arrayLocalesSchema);

  // Throw validation error
  if (!formatValidator.validate(_locales)) {
    throw formatValidator.error;
  }

  return _locales;
}

module.exports = {
  isValidLocaleCode,
  validateLocaleCode,
  validateLocaleCodeArray,
  validateLocale,
  validateLocalesArray,
  codeSchema,
  localeRegex,
  localeRegexString,
};
