const _ = require('lodash');
const getSchema = require('../dataset-schema/getSchema');
const getKeysCanAction = require('./getKeysCanAction');
const { validateExistValues } = require('../../validations/exists');
const { validatePluginName } = require('../../validations/exists');
const { table } = require('../tables');
const { getValuesForSave } = require('./getValuesForSave');
const { validateDataForJsonSchema } = require('./validateDataForJsonSchema');

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
 *  @param {any} _formData Form data to save
 *  @param {any=} transacting - DB Transaction
 *  @param {string=} target Any string to differentiate what you want, for example a user id.
 *  @param {UserAgent} userAgent - User auth
 *  @return {Promise<any>} Passed formData
 *  */
async function addValues(
  locationName,
  pluginName,
  _formData,
  userAgent,
  { target, transacting } = {}
) {
  validatePluginName(pluginName, this.calledFrom);
  await validateExistValues(locationName, pluginName, target, { transacting });

  const { jsonSchema } = await getSchema.call(this, locationName, pluginName, { transacting });

  // ES: Cogemos solos los campos a los que el usuario tiene permiso de edicion
  // EN: We take only the fields to which the user has permission to edit.
  const goodKeys = await getKeysCanAction(locationName, pluginName, userAgent, 'edit', {
    transacting,
  });

  const formData = {};
  _.forEach(goodKeys, (k) => {
    formData[k] = _formData[k];
  });

  // EN: Remove id ajv not support name if for a field
  _.forIn(jsonSchema.properties, (p) => {
    delete p.id;
  });

  // ES: Comprobamos que los datos cumplen con la validacion
  // EN: We check that the data complies with validation
  validateDataForJsonSchema(jsonSchema, formData);

  const toSave = [];
  _.forIn(formData, (value, key) => {
    const data = { locationName, pluginName, key };
    if (target) data.target = target;
    _.forEach(getValuesForSave(jsonSchema, key, value), (val) => {
      toSave.push({ ...data, ...val });
    });
  });

  await table.datasetValues.createMany(toSave, { transacting });

  return formData;
}

module.exports = addValues;
