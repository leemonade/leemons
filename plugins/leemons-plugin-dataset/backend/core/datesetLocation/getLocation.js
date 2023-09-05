const { validateNotExistLocation } = require('../../validations/exists');
const { validateLocationAndPluginAndLocale } = require('../../validations/datasetLocation');
const { getTranslationKey } = require('leemons-multilanguage');

/** *
 *  ES:
 *  Devuelve una localiacion de un dataset
 *
 *  EN:
 *  Returns a location of a dataset
 *
 *  @public
 *  @static
 *  @param {string} locationName - Location name
 *  @param {string} pluginName - Plugin name
 *  @param {any=} transacting - DB Transaction
 *  @param {string=} locale - Locale to return name and description
 *  @return {Promise<DatasetLocation>} The new dataset location
 *  */
async function getLocation({ locationName, pluginName, locale, ctx }) {
  validateLocationAndPluginAndLocale(locationName, pluginName, locale, false);
  await validateNotExistLocation({ locationName, pluginName, ctx });

  const promises = [ctx.tx.db.Dataset.findOne({ locationName, pluginName }).lean()];

  if (locale) {
    promises.push(
      ctx.tx.call('multilanguage.contents.getValue', {
        key: getTranslationKey({ locationName, pluginName, key: 'name', ctx }),
        locale,
      })
    );
    promises.push(
      ctx.tx.call('multilanguage.contents.getValue', {
        key: getTranslationKey({ locationName, pluginName, key: 'description', ctx }),
        locale,
      })
    );
  } else {
    promises.push(
      ctx.tx.call('multilanguage.contents.getLocaleValueWithKey', {
        key: getTranslationKey({ locationName, pluginName, key: 'name', ctx }),
      })
    );
    promises.push(
      ctx.tx.call('multilanguage.contents.getLocaleValueWithKey', {
        key: getTranslationKey({ locationName, pluginName, key: 'description', ctx }),
      })
    );
  }

  const [dataset, name, description] = await Promise.all(promises);

  if (name) dataset.name = name;
  if (description) dataset.description = description;

  delete dataset.jsonSchema;
  delete dataset.jsonUI;

  return dataset;
}

module.exports = getLocation;
