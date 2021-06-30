const {
  validatePluginName,
  validateNotExistLocation,
  validateNotExistSchema,
} = require('../../validations/exists');
const { validateAddSchema } = require('../../validations/dataset-schema');
const { table } = require('../tables');

/** *
 *  ES:
 *  Actualiza los schemas del dataset, solo el dueño de la localizacion puede actualiza los schemas
 *
 *  EN:
 *  Update the schemas of the dataset, only the owner of the locale can update the schemas
 *
 *  @public
 *  @static
 *  @param {DatasetUpdateSchema} data
 *  @param {any=} transacting - DB Transaction
 *  @return {Promise<DatasetSchema>}
 *  */
async function updateSchema(
  { locationName, pluginName, jsonSchema, jsonUI },
  { transacting } = {}
) {
  validateAddSchema({ locationName, pluginName, jsonSchema, jsonUI });
  validatePluginName(pluginName, this.calledFrom);
  await validateNotExistLocation(locationName, pluginName, { transacting });
  await validateNotExistSchema(locationName, pluginName, { transacting });

  const dataset = table.dataset.update(
    { locationName, pluginName },
    {
      jsonSchema: JSON.stringify(jsonSchema),
      jsonUI: JSON.stringify(jsonUI),
    },
    { transacting }
  );

  dataset.jsonSchema = JSON.parse(dataset.jsonSchema);
  dataset.jsonUI = JSON.parse(dataset.jsonUI);

  return dataset;
}

module.exports = updateSchema;
