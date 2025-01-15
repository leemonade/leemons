const _ = require('lodash');

const getDefaultLocale = require('../platform/getDefaultLocale');

/**
 * EN: Update translations for specific profile
 * @public
 * @static
 * @param {string} profile - Profile
 * @param {{name: any, description: any}} translations - Translations
 * @param {any} _transacting - DB Transaction
 * @return {Promise<any>} Created permissions-roles
 * */
async function updateProfileTranslations({ profile, translations: _translations, ctx }) {
  const translations = { ..._translations };
  const defaultLocale = await getDefaultLocale({ ctx });
  if (!translations.name) translations.name = {};
  if (!translations.description) translations.description = {};

  if (defaultLocale && !translations.name[defaultLocale]) {
    translations.name[defaultLocale] = profile.name;
  }
  if (defaultLocale && !translations.description[defaultLocale]) {
    translations.description[defaultLocale] = profile.description;
  }

  return Promise.all([
    ctx.tx.call('multilanguage.common.setKey', {
      key: ctx.prefixPN(`profile.${profile.id}.name`),
      data: _.pickBy(translations.name, _.identity),
    }),
    ctx.tx.call('multilanguage.common.setKey', {
      key: ctx.prefixPN(`profile.${profile.id}.description`),
      data: _.pickBy(translations.description, _.identity),
    }),
  ]);
}

module.exports = { updateProfileTranslations };
