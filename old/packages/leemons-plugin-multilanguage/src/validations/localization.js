const _ = require('lodash');
const { codeSchema } = require('./locale');

const { LeemonsValidator } = global.utils;

LeemonsValidator.ajv.addFormat('localizationKey', {
  validate: (x) => /^([a-zA-Z0-9_-]+\.){0,}[a-zA-Z0-9_-]{0,}$/.test(x),
});

module.exports = class Validator {
  constructor(_prefix) {
    const prefix = (_prefix || '').replace(/\./g, '\\.');
    /**
     * String with format localizationKey (xx.yy.bb1_-)
     * If the prefix is required, the key must be the prefix of start with the '${prefix}.'
     */
    this.keySchema = (usePrefix) => {
      const pattern = `([a-zA-Z0-9_-]+\\.){0,}[a-zA-Z0-9_-]{0,}`;
      return {
        type: 'string',
        pattern: `^(${usePrefix && prefix ? `((${prefix})|(${prefix}\\.${pattern}))` : pattern})$`,
        minLength: 1,
        maxLength: 255,
      };
    };

    /**
     * String with 1 <= length <= 65535
     */
    this.valueSchema = {
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
    this.localizationSchema = (usePrefix) => ({
      type: 'object',
      properties: {
        locale: codeSchema,
        key: this.keySchema(usePrefix),
        value: this.valueSchema,
      },
      required: ['locale', 'key', 'value'],
    });

    /**
     * Array of keys
     */
    this.keyArraySchema = (usePrefix) => ({
      type: 'array',
      items: this.keySchema(usePrefix),
    });

    /**
     * An object like the following one:
     * @example
     * {
     *   "locale": {
     *     "key": "value"
     *   }
     * }
     */
    this.localizationsBulkSchema = {
      type: 'object',
      properties: {
        oneOf: {
          type: 'object',
          properties: {
            oneOf: this.valueSchema,
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
    this.localizationArrayNoFormatSchema = {
      type: 'array',
      items: {
        anyOf: [
          {
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
                maxLength: 12,
              },
              value: {
                type: 'string',
                minLength: 1,
                maxLength: 65535,
              },
            },
          },
        ],
      },
    };

    /**
     * An array of localizations
     */
    this.localizationArraySchema = (usePrefix) => ({
      type: 'array',
      items: this.localizationSchema(usePrefix),
    });

    /**
     * An object with the tuple [locale, key]
     */
    this.localizationTupleSchema = (usePrefix) => ({
      type: 'object',
      properties: {
        locale: codeSchema,
        key: this.keySchema(usePrefix),
      },
      required: ['locale', 'key'],
    });

    /**
     * An array of tuples [locale, key]
     */
    this.localizationTupleArraySchema = (usePrefix) => ({
      type: 'array',
      items: this.localizationTupleSchema(usePrefix),
    });

    /**
     * An array with an array of locales in the first item
     * and an array of values in the second item
     */
    this.localeValueSchema = {
      type: 'array',
      items: [
        {
          type: 'array',
          items: codeSchema,
          minItems: 1,
        },
        {
          type: 'array',
          items: this.valueSchema,
          minItems: 1,
        },
      ],
      minItems: 2,
      maxItems: 2,
    };
  }

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
   * @param {boolean} usePrefix
   * @returns {{key: LocalizationKey, locale: LocaleCode, locales: LocaleCode[]}} The Localization with key and locale lowercased
   */
  validateLocalizationTuple({ key, locale, locales }, usePrefix = false) {
    if (!locales) {
      // Always save locale in lowercase
      const _locale = typeof locale === 'string' ? locale.toLowerCase() : null;
      const _key = typeof key === 'string' ? key : null;

      const validator = new LeemonsValidator(this.localizationTupleSchema(usePrefix));

      // Throw validation error
      if (!validator.validate({ key: _key, locale: _locale })) {
        throw validator.error;
      }

      return { key: _key, locale: _locale };
    }
    const _locales = [];
    const _key = typeof key === 'string' ? key : null;
    _.forEach(locales, (locale) => {
      const _locale = typeof locale === 'string' ? locale.toLowerCase() : null;
      const validator = new LeemonsValidator(this.localizationTupleSchema(usePrefix));

      // Throw validation error
      if (!validator.validate({ key: _key, locale: _locale })) {
        throw validator.error;
      }
      _locales.push(_locale);
    });
    return { key: _key, locales: _locales };
  }

  /**
   * Validates a localization array
   * @param {{key: LocalizationKey, locale: LocaleCode}[]}
   * @param {boolean} usePrefix
   * @returns {{key: LocalizationKey, locale: LocaleCode}[]} The Localization array with key and locale lowercased
   */
  validateLocalizationTupleArray(tuples, usePrefix = false) {
    // Get an array of tuples in lowercase or null
    const _tuples =
      Array.isArray(tuples) && tuples.every(Array.isArray)
        ? tuples.map(([key, locale]) => {
            const _locale = typeof locale === 'string' ? locale.toLowerCase() : null;
            const _key = typeof key === 'string' ? key : null;

            return { key: _key, locale: _locale };
          })
        : null;

    const validator = new LeemonsValidator(this.localizationTupleArraySchema(usePrefix));

    // Throw validation error
    if (!validator.validate(_tuples)) {
      throw validator.error;
    }

    return _tuples;
  }

  /**
   * Validates a localization
   * @param {Localization} localization
   * @param {boolean} usePrefix
   * @returns {Localization} The Localization with key and locale lowercased
   */
  validateLocalization({ key, locale, value }, usePrefix = false) {
    // Always save locale in lowercase
    const _locale = typeof locale === 'string' ? locale.toLowerCase() : null;
    const _key = typeof key === 'string' ? key : null;

    const validator = new LeemonsValidator(this.localizationSchema(usePrefix));

    // Throw validation error
    if (!validator.validate({ key: _key, locale: _locale, value })) {
      throw validator.error;
    }

    return { key: _key, locale: _locale, value };
  }

  /**
   * Validates a localization key
   * @param {LocalizationKey} key
   * @param {boolean} usePrefix
   * @returns {LocalizationKey}
   */
  validateLocalizationKey(key, usePrefix = false) {
    const _key = typeof key === 'string' ? key : null;

    const validator = new LeemonsValidator(this.keySchema(usePrefix));

    // Throw validation error
    if (!validator.validate(_key)) {
      throw validator.error;
    }

    return _key;
  }

  /**
   * Validates a localization keys
   * @param {LocalizationKey[]} keys
   * @param {boolean} usePrefix
   * @returns {LocalizationKey+}
   */
  validateLocalizationKeyArray(keys, usePrefix = false) {
    // Get the keys lowercased
    const _keys =
      Array.isArray(keys) && keys.every((key) => typeof key === 'string')
        ? keys.map((key) => key)
        : null;

    const validator = new LeemonsValidator(this.keyArraySchema(usePrefix));

    // Throw validation error
    if (!validator.validate(_keys)) {
      throw validator.error;
    }

    return _keys;
  }

  /**
   * Validates a localization array
   * @param {Localization[]} localizations
   * @param {boolean} usePrefix
   * @returns {Localization[]} The Localization with key and locale lowercased
   */
  validateLocalizationsArray(localizations, usePrefix = false) {
    const paramValidator = new LeemonsValidator(this.localizationArrayNoFormatSchema);

    if (!paramValidator.validate(localizations)) {
      throw paramValidator.error;
    }

    const _localizations = localizations.map(({ key, locale, value }) => ({
      key,
      locale: locale.toLowerCase(),
      value,
    }));

    const formattedValidator = new LeemonsValidator(this.localizationArraySchema(usePrefix));

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
  validateLocalizationsBulk(localizations) {
    const validator = new LeemonsValidator(this.localizationsBulkSchema);

    if (!validator.validate(localizations)) {
      throw validator.error;
    }
  }

  /**
   * Validates an object of { key: value }
   * @param {{[key:string]: LocalizationValue}} data
   * @returns {{[key:string]: LocalizationValue}} The original data with the locales lowercased
   */
  validateLocalizationLocaleValue(data) {
    const locales = Object.keys(data).map((locale) => locale.toLowerCase());
    const values = Object.values(data);

    const validator = new LeemonsValidator(this.localeValueSchema);

    if (!validator.validate([locales, values])) {
      throw validator.error;
    }

    return _.fromPairs(locales.map((locale, i) => [locale, values[i]]));
  }
};
