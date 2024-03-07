const _ = require('lodash');
const getSchema = require('../datasetSchema/getSchema');
const deleteValues = require('./deleteValues');
const getKeysCanAction = require('./getKeysCanAction');
const { validateNotExistValues } = require('../../validations/exists');
const { validatePluginName } = require('../../validations/exists');
const { getValuesForSave } = require('./getValuesForSave');
const { validateDataForJsonSchema } = require('./validateDataForJsonSchema');

/** *
 *  ES:
 *  Si no existen valores para los datos especificados devolvemos un error, si existen
 *  se comprueba con ajv que los datos pasados cumplen con lo descrito en el schema y se almacenan
 *  los campos
 *
 *  EN:
 *  If there are no values for the specified data we return an error, if there are values for the specified data we return an error, if there are values for the specified data we return an error.
 *  the data passed is checked with ajv to ensure that it complies with the schema and stored.
 *  the fields
 *
 *  @public
 *  @static
 *  @param {string} locationName Location name (For backend)
 *  @param {string} pluginName Plugin name (For backend)
 *  @param {any} _formData Form data to save
 *  @param {UserAgent} userAgent - User auth
 *  @param {any=} transacting - DB Transaction
 *  @param {string=} target Any string to differentiate what you want, for example a user id.
 *  @return {Promise<any>} Passed formData
 *  */
async function updateValues({
  locationName,
  pluginName,
  formData: _formData,
  userAgent,
  target,
  ctx,
}) {
  validatePluginName({ pluginName, calledFrom: ctx.callerPlugin, ctx });
  await validateNotExistValues({ locationName, pluginName, target, ctx });

  const { jsonSchema } = await getSchema({ locationName, pluginName, ctx });

  // ES: Cogemos solos los campos a los que el usuario tiene permiso de edicion
  // EN: We take only the fields to which the user has permission to edit.
  const goodKeys = await getKeysCanAction({
    locationName,
    pluginName,
    userAgent,
    actions: 'edit',
    ctx,
  });

  const formData = {};
  _.forEach(goodKeys, (k) => {
    formData[k] = _formData[k];
  });
  // EN: Remove id ajv not support name if for a field
  _.forIn(jsonSchema.properties, (p) => {
    delete p.id;
  });

  validateDataForJsonSchema({ jsonSchema, data: formData });

  const toSave = [];
  _.forIn(formData, (value, key) => {
    const data = { locationName, pluginName, key };
    if (target) data.target = target;
    _.forEach(getValuesForSave({ jsonSchema, key, value }), (val) => {
      toSave.push({ ...data, ...val });
    });
  });

  await deleteValues({ locationName, pluginName, target, ctx });
  await ctx.tx.db.DatasetValues.insertMany(toSave);

  return formData;
}

module.exports = updateValues;
