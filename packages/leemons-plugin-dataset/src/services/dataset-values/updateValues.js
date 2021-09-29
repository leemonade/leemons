const _ = require('lodash');
const getSchema = require('../dataset-schema/getSchema');
const deleteValues = require('./deleteValues');
const getKeysCanAction = require('./getKeysCanAction');
const { validateNotExistValues } = require('../../validations/exists');
const { validatePluginName } = require('../../validations/exists');
const { table } = require('../tables');

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
async function updateValues(
  locationName,
  pluginName,
  _formData,
  userAgent,
  { target, transacting: _transacting, hardUpdate } = {}
) {
  validatePluginName(pluginName, this.calledFrom);
  await validateNotExistValues(locationName, pluginName, target, { transacting: _transacting });

  const { jsonSchema } = await getSchema.call(this, locationName, pluginName, {
    transacting: _transacting,
  });

  // ES: Cogemos solos los campos a los que el usuario tiene permiso de edicion
  // EN: We take only the fields to which the user has permission to edit.
  const goodKeys = await getKeysCanAction(locationName, pluginName, userAgent, 'edit');
  const formData = {};
  _.forEach(goodKeys, (k) => {
    formData[k] = _formData[k];
  });
  // EN: Remove id ajv not support name if for a field
  _.forIn(jsonSchema.properties, (p) => {
    delete p.id;
  });
  // TODO AÑADIR VALIDADOR CUSTOM PARA NUMEROS DE TELEFONO/ETZ
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

  return global.utils.withTransaction(
    async (transacting) => {
      if (hardUpdate) {
        await deleteValues.call(this, locationName, pluginName, { target, transacting });
        await table.datasetValues.createMany(toSave, { transacting });
      } else {
        const promises = [];
        _.forEach(toSave, ({ value, ...rest }) => {
          promises.push(table.datasetValues.set(rest, { value, ...rest }, { transacting }));
        });
        await Promise.all(promises);
      }

      return formData;
    },
    table.datasetValues,
    _transacting
  );
}

module.exports = updateValues;
