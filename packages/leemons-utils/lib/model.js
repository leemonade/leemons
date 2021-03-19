const _ = require('lodash');

function generateModelName(target, originalModelName) {
  return `${target.replace(/\./g, '_')}::${originalModelName}`;
}

function getModelLocation(path, models = null) {
  let modelObject = null;
  if (models) {
    modelObject = models.find((model) => model.modelName === path);
  }
  if (!modelObject) {
    const absolutePath = path.split('::')[0].replace(/_/g, '.');
    modelObject = _.get(global.leemons, `${absolutePath}.models.${path}`);
  }
  return modelObject;
}

module.exports = { getModelLocation, generateModelName };
