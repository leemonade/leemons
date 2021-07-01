const _ = require('lodash');
const getSchema = require('../dataset-schema/getSchema');
const { validateExistValues } = require('../../validations/exists');
const { validatePluginName } = require('../../validations/exists');
const { table } = require('../tables');

/** *
 *  ES:
 *  Si ya existen valores para los datos especificados devolvemos un error, si no
 *  se comprueba con ajv que los datos pasados cumplen con lo descrito en el schema y se almacenan
 *  los campos
 *
 *  EN:
 *  If values already exist for the specified data we return an error, otherwise we return an error.
 *  the data passed is checked with ajv to ensure that it complies with the schema and stored.
 *  the fields
 *
 *  @public
 *  @static
 *  @param {string} locationName Location name (For backend)
 *  @param {string} pluginName Plugin name (For backend)
 *  @param {any} formData Form data to save
 *  @param {any=} transacting - DB Transaction
 *  @param {string=} target Any string to differentiate what you want, for example a user id.
 *  @return {Promise<any>} Passed formData
 *  */
async function addValues(locationName, pluginName, formData, { target, transacting } = {}) {
  validatePluginName(pluginName, this.calledFrom);
  await validateExistValues(locationName, pluginName, target, { transacting });

  const { jsonSchema } = await getSchema.call(this, locationName, pluginName);

  const validator = new global.utils.LeemonsValidator(
    {
      ...jsonSchema,
      additionalProperties: false,
    },
    { strict: false }
  );
  if (!validator.validate(formData)) throw validator.error;

  const toSave = [];
  _.forIn(formData, (value, key) => {
    const data = { locationName, pluginName, key, value: JSON.stringify(value) };
    if (target) data.target = target;
    toSave.push(data);
  });

  await table.datasetValues.createMany(toSave, { transacting });

  return formData;
}

module.exports = addValues;
