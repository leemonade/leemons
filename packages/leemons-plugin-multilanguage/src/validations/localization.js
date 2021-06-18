const { codeSchema } = require('./locale');

const { LeemonsValidator } = global.utils;

LeemonsValidator.ajv.addFormat('localizationKey', {
  validate: (x) => /^([a-z][a-z0-9_-]+\.){0,}[a-z][a-z0-9_-]+$/.test(x),
});

/**
 * String with format localizationKey (xx.yy.bb1_-)
 */
const keySchema = {
  type: 'string',
  format: 'localizationKey',
  minLength: 1,
  maxLength: 255,
};

/**
 * String with 1 <= length <= 65535
 */
const valueSchema = {
  type: 'string',
  minLength: 1,
  maxLength: 65535,
};

/**
 * An object with the properties:
 * @property key: String with format localizationKey (xx.yy.bb1_-)
 * @property locale: String with format localeCode (xx or xx-yy)
 * @property value: String with 1 <= length <= 65535
 */
const localizationSchema = {
  type: 'object',
  properties: {
    locale: codeSchema,
    key: keySchema,
    value: valueSchema,
  },
  required: ['locale', 'key', 'value'],
};

/**
 * Array of keys
 */
const keyArraySchema = {
  type: 'array',
  items: keySchema,
};

/**
 * An object like the following one:
 * @example
 * {
 *   "locale": {
 *     "key": "value"
 *   }
 * }
 */
const localizationsBulkSchema = {
  type: 'object',
  properties: {
    oneOf: {
      type: 'object',
      properties: {
        oneOf: valueSchema,
      },
    },
  },
};

/**
 * An object like the following one (no format is checked):
 * @example
 * {
 *   "locale": {
 *     "key": "value"
 *   }
 * }
 */
const localizationArrayNoFormatSchema = {
  type: 'array',
  items: {
    anyOf: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
        locale: {
          type: 'string',
          minLength: 2,
          maxLength: 5,
        },
        value: {
          type: 'string',
          minLength: 1,
          maxLength: 65535,
        },
      },
    },
  },
};

/**
 * An array of localizations
 */
const localizationArraySchema = {
  type: 'array',
  items: localizationSchema,
};

const localizationTupleSchema = {
  type: 'object',
  properties: {
    locale: codeSchema,
    key: keySchema,
  },
  required: ['locale', 'key'],
};

const localizationTupleArraySchema = {
  type: 'array',
  items: localizationTupleSchema,
};

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

/**
 * Validates a localization
 * @param {{key: LocalizationKey, locale: LocaleCode}}
 * @returns {{key: LocalizationKey, locale: LocaleCode}} The Localization with key and locale lowercased
 */
function validateLocalizationTuple({ key, locale }) {
  // Always save locale in lowercase
  const _locale = typeof locale === 'string' ? locale.toLowerCase() : null;
  const _key = typeof key === 'string' ? key.toLowerCase() : null;

  const validator = new LeemonsValidator(localizationTupleSchema);

  // Throw validation error
  if (!validator.validate({ key: _key, locale: _locale })) {
    throw validator.error;
  }

  return { key: _key, locale: _locale };
}

/**
 * Validates a localization array
 * @param {{key: LocalizationKey, locale: LocaleCode}[]}
 * @returns {{key: LocalizationKey, locale: LocaleCode}[]} The Localization array with key and locale lowercased
 */
function validateLocalizationTupleArray(tuples) {
  // Get an array of tuples in lowercase or null
  const _tuples =
    Array.isArray(tuples) && tuples.every(Array.isArray)
      ? tuples.map(([key, locale]) => {
          const _locale = typeof locale === 'string' ? locale.toLowerCase() : null;
          const _key = typeof key === 'string' ? key.toLowerCase() : null;

          return { key: _key, locale: _locale };
        })
      : null;

  const validator = new LeemonsValidator(localizationTupleArraySchema);

  // Throw validation error
  if (!validator.validate(_tuples)) {
    throw validator.error;
  }

  return _tuples;
}

/**
 * Validates a localization
 * @param {Localization} localization
 * @returns {Localization} The Localization with key and locale lowercased
 */
function validateLocalization({ key, locale, value }) {
  // Always save locale in lowercase
  const _locale = typeof locale === 'string' ? locale.toLowerCase() : null;
  const _key = typeof key === 'string' ? key.toLowerCase() : null;

  const validator = new LeemonsValidator(localizationSchema);

  // Throw validation error
  if (!validator.validate({ key: _key, locale: _locale, value })) {
    throw validator.error;
  }

  return { key: _key, locale: _locale, value };
}

/**
 * Validates a localization key
 * @param {LocalizationKey} key
 * @returns {LocalizationKey}
 */
function validateLocalizationKey(key) {
  const _key = typeof key === 'string' ? key.toLowerCase() : null;

  const validator = new LeemonsValidator(keySchema);

  // Throw validation error
  if (!validator.validate(_key)) {
    throw validator.error;
  }

  return _key;
}

/**
 * Validates a localization keys
 * @param {LocalizationKey[]} keys
 * @returns {LocalizationKey+}
 */
function validateLocalizationKeyArray(keys) {
  // Get the keys lowercased
  const _keys =
    Array.isArray(keys) && keys.every((key) => typeof key === 'string')
      ? keys.map((key) => key.toLowerCase())
      : null;

  const validator = new LeemonsValidator(keyArraySchema);

  // Throw validation error
  if (!validator.validate(_key)) {
    throw validator.error;
  }

  return _keys;
}

/**
 * Validates a localization array
 * @param {Localization[]} localizations
 * @returns {Localization[]} The Localization with key and locale lowercased
 */
function validateLocalizationsArray(localizations) {
  const paramValidator = new LeemonsValidator(localizationArrayNoFormatSchema);

  if (!paramValidator.validate(localizations)) {
    throw paramValidator.error;
  }

  const _localizations = localizations.map(({ key, locale, value }) => ({
    key: key.toLowerCase(),
    locale: locale.toLowerCase(),
    value,
  }));

  const formattedValidator = new LeemonsValidator(localizationArraySchema);

  // Throw validation error
  if (!formattedValidator.validate(_localizations)) {
    throw formattedValidator.error;
  }

  return _localizations;
}

/**
 * validates a bulk loading schema of localizations
 * @param {{[locale:string]: {[key:string]: LocalizationValue}} localizations
 */
function validateLocalizationsBulk(localizations) {
  const validator = new LeemonsValidator(localizationsBulkSchema);

  if (!validator.validate(localizations)) {
    throw validator.error;
  }
}

module.exports = {
  validateLocalizationKey,
  validateLocalizationKeyArray,
  validateLocalizationTuple,
  validateLocalizationTupleArray,
  validateLocalization,
  validateLocalizationsArray,
  validateLocalizationsBulk,
};
