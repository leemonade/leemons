const { translations, getTranslationKey } = require('../translations');
const existLocation = require('./existLocation');
const { table } = require('../tables');

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
 *  @return {Promise<Action>} The new dataset location
 *  */
async function getLocation(locationName, pluginName, { locale, transacting } = {}) {
  if (!(await existLocation(locationName, pluginName, { transacting })))
    throw new Error(`The '${locationName}' location not exist`);
  const promises = [table.dataset.findOne({ locationName, pluginName }, { transacting })];

  if (translations()) {
    if (locale) {
      promises.push(
        translations().contents.getValue(
          getTranslationKey(locationName, pluginName, 'name'),
          locale,
          {
            transacting,
          }
        )
      );
      promises.push(
        translations().contents.getValue(
          getTranslationKey(locationName, pluginName, 'description'),
          locale,
          { transacting }
        )
      );
    } else {
      promises.push(
        translations().contents.getLocaleValueWithKey(
          getTranslationKey(locationName, pluginName, 'name'),
          { transacting }
        )
      );
      promises.push(
        translations().contents.getLocaleValueWithKey(
          getTranslationKey(locationName, pluginName, 'description'),
          { transacting }
        )
      );
    }
  }

  const [dataset, name, description] = await Promise.all(promises);

  if (name) dataset.name = name;
  if (description) dataset.description = description;

  return dataset;
}

module.exports = getLocation;
