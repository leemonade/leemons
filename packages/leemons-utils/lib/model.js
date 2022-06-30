const _ = require('lodash');

function generateModelName(target, originalModelName) {
  const errorMessage = [];
  if (typeof target !== 'string') {
    errorMessage.push('The target argument must be a string.');
  } else if (target.length === 0) {
    errorMessage.push('The target argument can not be an empty string.');
  }
  if (typeof originalModelName !== 'string') {
    errorMessage.push('The originalModelName argument must be a string.');
  } else if (originalModelName.length === 0) {
    errorMessage.push('The originalModelName argument can not be an empty string.');
  }

  if (errorMessage.length) {
    throw new Error(errorMessage.join('\n'));
  }

  return `${target.replace(/\./g, '_')}::${originalModelName}`;
}

/**
 *
 * @param {string} path The path for the model
 * @param {object[]} models The models to search into (if null, it will search in leemons models)
 * @param {boolean} useLeemonsModels Use leemons models if not found in provided models
 * @returns {object|null} The requested model if found, if not, returns null
 */
function getModel(path, models = null, useLeemonsModels = false) {
  if (typeof path !== 'string') {
    return null;
  }

  if (models) {
    if (!Array.isArray(models)) {
      throw new Error('The provided models must be an array');
    }
    const modelObject = models.find((model) => model.modelName === path);
    if (modelObject || !useLeemonsModels) {
      return modelObject === undefined ? null : modelObject;
    }
  }

  const absolutePath = path.split('::')[0].replace(/_/g, '.');
  return _.get(leemons, `${absolutePath}.models.${path}`, null);
}

module.exports = { getModel, generateModelName };
