const { getTranslationKey } = require('@leemons/multilanguage');
const { validatePluginName, validateNotExistLocation } = require('../../validations/exists');
const { validateLocationAndPlugin } = require('../../validations/datasetLocation');
const deleteSchema = require('../datasetSchema/deleteSchema');

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
 *  @return {Promise<boolean>} The new dataset location
 *  */
async function deleteLocation({ locationName, pluginName, deleteValues, ctx }) {
  validateLocationAndPlugin(locationName, pluginName);
  validatePluginName({ pluginName, calledFrom: ctx.callerPlugin, ctx });
  await validateNotExistLocation({ locationName, pluginName, ctx });

  await deleteSchema({ locationName, pluginName, deleteValues, ctx });
  const promises = [ctx.tx.db.Dataset.deleteOne({ locationName, pluginName })];
  promises.push(
    ctx.tx.call('multilanguage.contents.deleteAll', {
      key: getTranslationKey({ locationName, pluginName, key: 'name', ctx }),
    })
  );
  promises.push(
    ctx.tx.call('multilanguage.contents.deleteAll', {
      key: getTranslationKey({ locationName, pluginName, key: 'description', ctx }),
    })
  );
  promises.push(
    ctx.tx.call('multilanguage.contents.deleteAll', {
      key: getTranslationKey({ locationName, pluginName, key: 'jsonSchema', ctx }),
    })
  );
  promises.push(
    ctx.tx.call('multilanguage.contents.deleteAll', {
      key: getTranslationKey({ locationName, pluginName, key: 'jsonUI', ctx }),
    })
  );
  await Promise.all(promises);
  return true;
}

module.exports = deleteLocation;
