const { translations, getTranslationKey } = require('../translations');
const existLocation = require('./existLocation');
const { table } = require('../tables');

/** *
 *  ES:
 *  Borra una localización y todas sus traducciones
 *
 *  EN:
 *  Deletes a localization and all its translations
 *
 *  @public
 *  @static
 *  @param {string} locationName - Location name
 *  @param {string} pluginName - Plugin name
 *  @param {any=} transacting - DB Transaction
 *  @return {Promise<Action>} The new dataset location
 *  */
async function deleteLocation(locationName, pluginName, { transacting: _transacting } = {}) {
  if (pluginName !== this.calledFrom) throw new Error(`The plugin name must be ${this.calledFrom}`);
  if (!(await existLocation(locationName, pluginName, { transacting: _transacting })))
    throw new Error(`The '${locationName}' location not exist`);
  return global.utils.withTransaction(
    async (transacting) => {
      const promises = [table.dataset.create({ locationName, pluginName }, { transacting })];
      if (translations()) {
        promises.push(
          translations().contents.addManyByKey(
            getTranslationKey(locationName, pluginName, 'name'),
            name,
            { transacting }
          )
        );
        promises.push(
          translations().contents.addManyByKey(
            getTranslationKey(locationName, pluginName, 'description'),
            description,
            { transacting }
          )
        );
      }
      const response = await Promise.all(promises);
      if (response[1] && !response[1].warnings) response[0].name = name;
      if (response[2] && !response[2].warnings) response[0].description = description;
      return response[0];
    },
    table.dataset,
    _transacting
  );
}

module.exports = deleteLocation;
