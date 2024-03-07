const existValues = require('./existValues');
const addValues = require('./addValues');
const updateValues = require('./updateValues');

async function setValues({ locationName, pluginName, values, userAgent, target, ctx }) {
  const func = {
    addValues,
    updateValues,
  };
  let functionName = 'addValues';
  if (await existValues({ locationName, pluginName, target, ctx })) {
    functionName = 'updateValues';
  }
  return func[functionName]({
    locationName,
    pluginName,
    formData: values,
    userAgent,
    target,
    ctx,
  });
}

module.exports = setValues;
