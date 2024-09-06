const addValues = require('./addValues');
const existValues = require('./existValues');
const updateValues = require('./updateValues');

async function setValues({ locationName, pluginName, values, userAgent, target, ctx }) {
  if (!values) {
    return {};
  }

  const payload = {
    locationName,
    pluginName,
    formData: values,
    userAgent,
    target,
    ctx,
  };

  let result = {};

  const exist = await existValues({ locationName, pluginName, target, ctx });

  if (exist) {
    result = await updateValues(payload);
  } else {
    result = await addValues(payload);
  }

  return result;
}

module.exports = setValues;
