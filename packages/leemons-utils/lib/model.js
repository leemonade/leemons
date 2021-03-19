const _ = require('lodash');

function generateModelName(target, originalModelName) {
  return `${target.replace(/\./g, '_')}::${originalModelName}`;
}

function getModelLocation(path, leemons = global.leemons) {
  const absolutePath = path.split('::')[0].replace(/_/g, '.');
  return _.get(leemons, `${absolutePath}.models.${path}`);
}

module.exports = { getModelLocation, generateModelName };
