/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');
const getSchema = require('./getSchema');
const { translations, getTranslationKey } = require('../translations');

/** *
 *  ES:
 *  Añade los schemas del dataset, solo el dueño de la localizacion puede añadir los schemas.
 *  Si ya existe un schema para esa localizacion devolvera un error
 *
 *  EN:
 *  Adds the schemas of the dataset, only the owner of the location can add schemas.
 *  If a schema already exists for that location it will return an error.
 *
 *  @public
 *  @static
 *  @param {string} locationName - Location name
 *  @param {string} pluginName - Plugin name
 *  @param {any=} transacting - DB Transaction
 *  @return {Promise<DatasetSchema>} The new dataset location
 *  */
async function recalculeEnumNames(locationName, pluginName, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const [dataset, localeSchemas] = await Promise.all([
        getSchema(locationName, pluginName, { transacting }),
        translations().contents.getLocaleValueWithKey(
          getTranslationKey(locationName, pluginName, 'jsonSchema'),
          { transacting }
        ),
        /*
        translations().contents.getLocaleValueWithKey(
          getTranslationKey(locationName, pluginName, 'jsonUI'),
          { transacting }
        ),

         */
      ]);

      // eslint-disable-next-line no-return-assign
      _.forIn(localeSchemas, (value, key) => (localeSchemas[key] = JSON.parse(value)));
      // _.forIn(localeUi, (value, key) => (localeUi[key] = JSON.parse(value)));

      _.forIn(dataset.jsonSchema.properties, (value, key) => {
        if (value.frontConfig.checkboxValues) {
          _.forIn(localeSchemas, (localeSchema) => {
            // ES: Si no existe la propiedad la creamos con todos los campos vacios.
            if (!localeSchema.properties[key]) localeSchema.properties[key] = {};
            if (!localeSchema.properties[key].frontConfig)
              localeSchema.properties[key].frontConfig = {};
            if (!localeSchema.properties[key].frontConfig.checkboxLabels) {
              localeSchema.properties[key].frontConfig.checkboxLabels = {};
              _.forEach(value.frontConfig.checkboxValues, ({ key: generatedKey }) => {
                localeSchema.properties[key].frontConfig.checkboxLabels[generatedKey] = {
                  key: generatedKey,
                  label: '',
                };
              });
            }
            if (!localeSchema.properties[key].items) localeSchema.properties[key].items = {};
            if (!localeSchema.properties[key].items.enumNames)
              localeSchema.properties[key].items.enumNames = [];

            const localeCheckboxByKey = _.cloneDeep(
              localeSchema.properties[key].frontConfig.checkboxLabels
            );

            localeSchema.properties[key].items.enumNames = [];
            localeSchema.properties[key].frontConfig.checkboxLabels = {};
            _.forEach(value.frontConfig.checkboxValues, (checkbox) => {
              if (localeCheckboxByKey[checkbox.key]) {
                localeSchema.properties[key].frontConfig.checkboxLabels[checkbox.key] = {
                  key: checkbox.key,
                  label: localeCheckboxByKey[checkbox.key].label,
                };
                localeSchema.properties[key].items.enumNames.push(
                  localeCheckboxByKey[checkbox.key].label
                );
              } else {
                localeSchema.properties[key].frontConfig.checkboxLabels[checkbox.key] = {
                  key: checkbox.key,
                  label: '',
                };
                localeSchema.properties[key].items.enumNames.push('');
              }
            });
          });
        }
      });

      // eslint-disable-next-line no-return-assign
      _.forIn(localeSchemas, (value, key) => (localeSchemas[key] = JSON.stringify(value)));

      await translations().contents.setKey(
        getTranslationKey(locationName, pluginName, 'jsonSchema'),
        localeSchemas,
        { transacting }
      );
      return true;
    },
    table.dataset,
    _transacting
  );
}

module.exports = recalculeEnumNames;
