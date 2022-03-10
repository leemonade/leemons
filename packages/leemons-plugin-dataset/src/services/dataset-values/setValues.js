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
  return func[functionName].call(this, locationName, pluginName, values, userAgent, {
    target,
    transacting,
  });
}

module.exports = setValues;
