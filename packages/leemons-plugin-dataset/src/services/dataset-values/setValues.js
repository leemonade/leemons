const _ = require('lodash');
const getSchema = require('../dataset-schema/getSchema');
const getKeysCanAction = require('./getKeysCanAction');
const { validateExistValues } = require('../../validations/exists');
const { validatePluginName } = require('../../validations/exists');
const { table } = require('../tables');
const { getValuesForSave } = require('./getValuesForSave');
const { validateDataForJsonSchema } = require('./validateDataForJsonSchema');
const existValues = require('./existValues');
const addValues = require('./addValues');
const updateValues = require('./updateValues');

async function setValues(
  locationName,
  pluginName,
  values,
  userAgent,
  { target, transacting } = {}
) {
  const func = {
    addValues,
    updateValues,
  };
  let functionName = 'addValues';
  if (await existValues(locationName, pluginName, { target, transacting })) {
    functionName = 'updateValues';
  }
  return func[functionName](locationName, pluginName, values, userAgent, {
    target,
    transacting,
  });
}

module.exports = setValues;
