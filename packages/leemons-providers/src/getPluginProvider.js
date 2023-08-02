async function getPluginProvider({ keyValueModel, providerName }) {
  return keyValueModel.findOne({ key: '_providers_', value: { pluginName: providerName } }).lean();
}

module.exports = { getPluginProvider };
