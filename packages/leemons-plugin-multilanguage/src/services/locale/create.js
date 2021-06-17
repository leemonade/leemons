const localesTable = leemons.query('plugins_multilanguage::locales');
const { LeemonsValidator } = global.utils;

const { has: hasLocale, hasMany: hasLocales } = require('./has');

LeemonsValidator.ajv.addFormat('localeCode', {
  validate: (x) => /^(([a-z]{2})|([a-z]{2}-[a-z]{2}))$/.test(x),
});

/**
 * Adds one locale to the database if it does not exist
 *
 * @param {string} code The locale iso code xx-YY or xx
 * @param {string} name The display name of the given locale
 *
 * @returns {Promise<Locale> | Promise<null>} null if the locale already exists and the locale object if created
 */
async function add(code, name) {
  // Always save locale in lowercase
  const _code = typeof code === 'string' ? code.toLowerCase() : null;
  /**
   * Code must be of type localeCode
   * Name must be a string of 1 <= length <= 255
   */
  const validator = new LeemonsValidator({
    type: 'object',
    properties: {
      code: {
        type: 'string',
        format: 'localeCode',
        minLength: 2,
        maxLength: 5,
      },
      name: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
      },
    },
    required: ['code', 'name'],
  });

  // Throw validation error
  if (!validator.validate({ code: _code, name })) {
    throw validator.error;
  }

  try {
    // If the locale does not exists, create it
    if (!(await hasLocale(_code))) {
      const locale = await localesTable.create({ code: _code, name });

      leemons.log.info(`New locale added: ${code} | ${name}`);

      return locale;
    }
    // If already exists, return null
    return null;
  } catch (e) {
    leemons.log.error(e.message);
    throw new Error('An error occurred while creating the locale');
  }
}

/**
 * Adds many locales to the database. Only adds those not existing
 *
 * @param {string[][]} locales An array of locales ([code, name])
 *
 * @returns {Promise<Locale[]> | Promise<[]>} [] if all the locales already exists and an array of locale objects created
 *
 * @example
 * addMany([
 *  ['es-ES', 'Español de España'],
 *  ['en-US', 'English of the United States'],
 * ]);
 */
async function addMany(locales) {
  /**
   * The locales must be an array of arrays:
   *   Element 0 must be a string 2 <= length <= 5
   *   Element 1 must be a string of 1 <= length <= 255
   */
  const paramsValidator = new LeemonsValidator({
    type: 'array',
    items: {
      type: 'array',
      minItems: 2,
      maxItems: 2,
      items: [
        {
          type: 'string',
          minLength: 2,
          maxLength: 5,
        },
        {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
      ],
    },
  });

  // Throw validation error
  if (!paramsValidator.validate(locales)) {
    throw paramsValidator.error;
  }
  // Get the locales with the code lower cased
  const _locales = locales.map(([code, name]) => ({
    code: code.toLowerCase(),
    name,
  }));

  /**
   * The locales must be an array of the interfaces:
   *   Code must be of type localeCode
   *   Name must be a string of 1 <= length <= 255
   */
  const formatValidator = new LeemonsValidator({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          format: 'localeCode',
          minLength: 2,
          maxLength: 5,
        },
        name: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
      },
      required: ['code', 'name'],
    },
  });

  // Throw validation error
  if (!formatValidator.validate(_locales)) {
    throw formatValidator.error;
  }

  const codes = _locales.map((locale) => locale.code);

  // Check for duplicated codes
  if (codes.length > [...new Set(codes)].length) {
    throw new Error('The inserted locale codes should be unique');
  }

  try {
    return await localesTable.transaction(async (t) => {
      // Check which of the provided locales exists
      const existingLocales = await hasLocales(codes);

      // Get the locales not present in the database
      const newLocales = _locales.filter((locale) => !existingLocales[locale.code]);

      // If not newLocales, return an empty array
      if (newLocales.length === 0) {
        return [];
      }

      // Return the new locales
      const addedLocales = await localesTable.createMany(newLocales, { transacting: t });
      leemons.log.info(
        `New locales added: ${newLocales
          .map((locale) => `${locale.code} | ${locale.name}`)
          .join(', ')}`
      );
      return addedLocales;
    });
  } catch (e) {
    leemons.log.error(e.message);
    throw new Error('An error occurred while creating the locales');
  }
}

module.exports = { add, addMany };
