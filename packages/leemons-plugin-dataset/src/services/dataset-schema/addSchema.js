const getLocation = require('../dataset-location/getLocation');
const existLocation = require('../dataset-location/existLocation');
const { validateAddSchema } = require('../../validations/dataset-schema');
const { table } = require('../tables');

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
 *  @param {DatasetAddSchema} data - New dataset location
 *  @param {any=} transacting - DB Transaction
 *  @return {Promise<DatasetSchema>} The new dataset location
 *  */
async function addSchema({ locationName, pluginName, jsonSchema, jsonUI }, { transacting } = {}) {
  validateAddSchema({ locationName, pluginName, jsonSchema, jsonUI });
  if (pluginName !== this.calledFrom) throw new Error(`The plugin name must be ${this.calledFrom}`);
  if (!(await existLocation(locationName, pluginName, { transacting })))
    throw new Error(`The '${locationName}' location not exist`);

  const location = await getLocation(locationName, pluginName, { transacting });
  if (location.jsonSchema || location.jsonUI)
    throw new Error(`A schema already exists for '${locationName}' dataset location`);

  const dataset = await table.dataset.update(
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

module.exports = addSchema;
