const { isEmpty } = require('lodash');

const { CUSTOMIZABLE_TRANSLATION_KEYS, pluginName } = require('../../config/constants');

function getKeys(programId) {
  return Object.values(CUSTOMIZABLE_TRANSLATION_KEYS).map(
    (element) => `${pluginName}.program.${programId}.${element}`
  );
}

async function fetchCopies({ ctx, ids, locale }) {
  const allKeys = ids.reduce((acc, programId) => [...acc, ...getKeys(programId)], []);
  return ctx.tx.call('multilanguage.contents.getManyWithLocale', {
    keys: allKeys,
    locale,
    isPrivate: true,
  });
}

function formatSingleLocaleResult(copies) {
  if (!copies || isEmpty(copies)) return {};

  return Object.entries(copies).reduce((result, [key, value]) => {
    const segments = key.split('.');
    const programId = segments[2];
    const propertyName = segments[segments.length - 1];

    if (!result[programId]) {
      result[programId] = {};
    }

    result[programId][propertyName] = value;
    return result;
  }, {});
}

function formatMultiLocaleResult({ ids, localeCodes, allCopies }) {
  if (!allCopies || isEmpty(allCopies)) return {};

  return ids.reduce((acc, programId) => {
    acc[programId] = localeCodes.reduce((localeAcc, localeCode, index) => {
      const keys = getKeys(programId);
      const programCopies = [];
      keys.forEach((key) => {
        if (allCopies[index][key]) {
          programCopies.push({ key, value: allCopies[index][key] });
        }
      });

      localeAcc[localeCode] = programCopies.reduce((copyAcc, copy) => {
        const propertyName = copy.key.split('.').pop();
        copyAcc[propertyName] = copy.value;
        return copyAcc;
      }, {});
      return localeAcc;
    }, {});
    return acc;
  }, {});
}

async function getProgramCustomNomenclature({ ids, ctx, allLocales: bringAllLocales }) {
  const normalizedIds = Array.isArray(ids) ? ids : [ids];

  if (!bringAllLocales) {
    const userLocale = ctx.meta.userSession.locale;
    const copies = await fetchCopies({ ctx, ids: normalizedIds, locale: userLocale });
    return formatSingleLocaleResult(copies);
  }

  const allLocales = await ctx.tx.call('multilanguage.locales.getAll', { ctx });
  const localeCodes = allLocales.map((locale) => locale.code);

  const allCopies = await Promise.all(
    localeCodes.map((locale) => fetchCopies({ ctx, ids: normalizedIds, locale }))
  );

  return formatMultiLocaleResult({ ids: normalizedIds, localeCodes, allCopies });
}

module.exports = {
  getProgramCustomNomenclature,
};
