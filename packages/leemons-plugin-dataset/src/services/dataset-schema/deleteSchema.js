const getLocation = require('../dataset-location/getLocation');
const { getTranslationKey, translations } = require('../translations');

const existLocation = require('../dataset-location/existLocation');
const existSchema = require('./existSchema');
const { table } = require('../tables');

/** *
 *  ES:
 *  Borra un schema y todos los datos de las traducciones que existieran
 *
 *  EN:
 *  Deletes a schema and all existing translation data
 *
 *  @public
 *  @static
 *  @param {string} locationName Location name (For backend)
 *  @param {string} pluginName Plugin name (For backend)
 *  @param {any=} transacting - DB Transaction
 *  @return {Promise<boolean>} Return true if delete is ok
 *  */
async function deleteSchema(locationName, pluginName, { transacting: _transacting } = {}) {
  if (pluginName !== this.calledFrom) throw new Error(`The plugin name must be ${this.calledFrom}`);
  if (!(await existLocation(locationName, pluginName, { transacting: _transacting })))
    throw new Error(`The '${locationName}' location not exist`);
  if (!(await existSchema(locationName, pluginName, { transacting: _transacting })))
    throw new Error(`No schema for '${locationName}' dataset location`);

  return global.utils.withTransaction(
    async (transacting) => {
      const promises = [
        table.dataset.update(
          { locationName, pluginName },
          {
            jsonSchema: null,
            jsonUI: null,
          },
          { transacting }
        ),
      ];
      if (translations()) {
        promises.push(
          translations().contents.deleteAll(
            { key: getTranslationKey(locationName, pluginName, 'jsonSchema') },
            { transacting }
          )
        );
        promises.push(
          translations().contents.deleteAll(
            { key: getTranslationKey(locationName, pluginName, 'jsonUI') },
            { transacting }
          )
        );
      }

      await Promise.all(promises);

      return true;
    },
    table.dataset,
    _transacting
  );
}

module.exports = deleteSchema;
