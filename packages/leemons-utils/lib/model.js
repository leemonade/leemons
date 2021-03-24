const _ = require('lodash');

function generateModelName(target, originalModelName) {
  return `${target.replace(/\./g, '_')}::${originalModelName}`;
}

function getModel(path, models = null) {
  let modelObject = null;
  if (models) {
    modelObject = models.find((model) => model.modelName === path);
  }
  if (!modelObject) {
    const absolutePath = path.split('::')[0].replace(/_/g, '.');
    modelObject = _.get(global.leemons, `${absolutePath}.models.${path}`, null);
  }
  return modelObject;
}

module.exports = { getModel, generateModelName };
