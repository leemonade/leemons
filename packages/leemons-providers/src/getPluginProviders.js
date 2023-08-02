const _ = require('lodash');

async function getPluginProviders({ keyValueModel, raw }) {
  const registers = await keyValueModel.find({ key: '_providers_' }).lean();
  if (registers) {
    if (raw) return _.map(registers, 'value');
    return _.map(registers, 'value.pluginName');
  }
  return [];
}

module.exports = { getPluginProviders };
