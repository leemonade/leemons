const {
  validatePluginName,
  validateNotExistLocation,
  validateNotExistSchema,
} = require('../../validations/exists');
const { getTranslationKey, translations } = require('../translations');
const { validateLocationAndPlugin } = require('../../validations/dataset-location');
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
  validateLocationAndPlugin(locationName, pluginName);
  validatePluginName(pluginName, this.calledFrom);
  await validateNotExistLocation(locationName, pluginName, { transacting: _transacting });
  await validateNotExistSchema(locationName, pluginName, { transacting: _transacting });

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
