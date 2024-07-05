/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const getSchema = require('../datasetSchema/getSchema');
const deleteValues = require('./deleteValues');
const getKeysCanAction = require('./getKeysCanAction');
const { validateNotExistValues } = require('../../validations/exists');
const { validatePluginName } = require('../../validations/exists');
const { getValuesForSave } = require('./getValuesForSave');
const { validateDataForJsonSchema } = require('./validateDataForJsonSchema');

/**
 * Updates values for a specified dataset if they exist. This function performs several checks:
 * 1. Validates that values exist for the specified data.
 * 2. Checks user permissions for editing the data.
 * 3. Validates the input data against the dataset's JSON schema.
 * 4. Updates the values in the database.
 *
 * @public
 * @static
 * @async
 * @param {Object} params - The parameters for updating values.
 * @param {string} params.locationName - Location name (For backend).
 * @param {string} params.pluginName - Plugin name (For backend).
 * @param {Object} params.formData - Form data to save. This should be an object with keys corresponding to the dataset schema.
 * @param {Object} params.userAgent - User authentication information.
 * @param {string} [params.target] - Any string to differentiate what you want, for example a user id.
 * @param {Context} params.ctx - The Moleculer context, which should include the transaction (ctx.tx) and caller plugin information.
 * @throws {LeemonsError} Throws an error if the data does not comply with the schema or if the values don't exist.
 * @return {Promise<Object>} Returns a promise that resolves to the updated form data.
 */
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

  // EN: We take only the fields to which the user has permission to edit.
  const [{ goodKeys, optionalKeys }, { goodKeys: viewKeys }] = await Promise.all([
    getKeysCanAction({
      locationName,
      pluginName,
      userAgent,
      actions: 'edit',
      ctx,
    }),
    getKeysCanAction({
      locationName,
      pluginName,
      userAgent,
      actions: 'view',
      ctx,
    }),
  ]);

  const formData = {};

  _.forEach(goodKeys, (k) => {
    formData[k] = _formData[k];
  });

  // EN: Remove id ajv not support name if for a field
  _.forIn(jsonSchema.properties, (p) => {
    delete p.id;
  });

  try {
    const allowedRequiredKeys = goodKeys.filter((key) => !optionalKeys.includes(key));
    validateDataForJsonSchema({ jsonSchema, data: formData, allowedRequiredKeys });
  } catch (error) {
    throw new LeemonsError(ctx, { message: 'Data does not comply with the schema' });
  }

  const toSave = [];
  _.forIn(formData, (value, key) => {
    const data = { locationName, pluginName, key };
    if (target) data.target = target;
    _.forEach(getValuesForSave({ jsonSchema, key, value }), (val) => {
      toSave.push({ ...data, ...val });
    });
  });

  // Now, we check if _formData has other keys that are not in goodKeys so add them to toSave[]
  const keysToCheck = _.difference(viewKeys, goodKeys);

  // Loop over the _formData and check if the key is in keysToCheck
  _.forEach(keysToCheck, (key) => {
    if (_formData[key]) {
      const data = { locationName, pluginName, key };
      if (target) data.target = target;
      _.forEach(getValuesForSave({ jsonSchema, key, value: _formData[key] }), (val) => {
        toSave.push({ ...data, ...val });
      });
    }
  });

  await deleteValues({ locationName, pluginName, target, ctx });
  await ctx.tx.db.DatasetValues.insertMany(toSave);

  const allRequiredCompleted = _.every(
    jsonSchema.required,
    (requiredKey) => formData[requiredKey]?.value
  );

  return { formData, completed: allRequiredCompleted };
}

module.exports = updateValues;
