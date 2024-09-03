const _ = require('lodash');

const existValues = require('./existValues');
const getKeysCanAction = require('./getKeysCanAction');
const { getValuesForReturn } = require('./getValuesForReturn');

/** *
 *  ES:
 *  Devuelve si existen los datos solicitas o si se le especifica alguna key solo el valor de dichas keys
 *
 *  EN:
 *  Returns if the requested data exists or if any key is specified only the value of these keys.
 *
 *  @public
 *  @static
 *  @param {string} locationName Location name (For backend)
 *  @param {string} pluginName Plugin name (For backend)
 *  @param {UserAgent} userAgent - User auth
 *  @param {string[]=} keys Keys to get
 *  @param {any=} transacting - DB Transaction
 *  @param {string=} target Any string to differentiate what you want, for example a user id.
 *  @return {Promise<any>} Passed formData
 *  */
async function getValues({ locationName, pluginName, userAgent, target, keys, ctx }) {
  const exist = await existValues({ locationName, pluginName, target, ctx });
  if (!exist) {
    return null;
  }

  let _keys = keys;

  const query = { locationName, pluginName };
  if (target) query.target = target;
  if (keys && !_.isArray(keys)) _keys = [keys];
  if (_keys) query.key = _keys;

  const response = await ctx.tx.db.DatasetValues.find(query).lean();
  const valuesByKey = _.groupBy(response, 'key');

  const data = response.reduce((acc, value) => {
    acc[value.key] = getValuesForReturn(valuesByKey[value.key]);
    return acc;
  }, {});

  const { goodKeys } = await getKeysCanAction({
    locationName,
    pluginName,
    userAgent,
    actions: ['view', 'edit'],
    ctx,
  });

  const result = {};
  _.forEach(goodKeys, (k) => {
    result[k] = data[k];
  });

  return result;
}

module.exports = getValues;
