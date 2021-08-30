const _ = require('lodash');
const { table } = require('../tables');
const { translations: trans } = require('../translations');
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
async function updateProfileTranslations(
  profile,
  translations,
  { transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      const t = trans();

      const defaultLocale = await getDefaultLocale();
      if (!translations.name) translations.name = {};
      if (!translations.description) translations.description = {};
      translations.name[defaultLocale] = profile.name;
      translations.description[defaultLocale] = profile.description;

      return Promise.all([
        t.common.setKey(
          leemons.plugin.prefixPN(`profile.${profile.id}.name`),
          _.pickBy(translations.name, _.identity),
          {
            transacting,
          }
        ),
        t.common.setKey(
          leemons.plugin.prefixPN(`profile.${profile.id}.description`),
          _.pickBy(translations.description, _.identity),
          { transacting }
        ),
      ]);
    },
    table.profiles,
    _transacting
  );
}

module.exports = { updateProfileTranslations };
