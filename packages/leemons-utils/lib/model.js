const _ = require('lodash');

function getModelLocation(path, leemons = global.leemons) {
  const ref = path.split('.');
  let modelName = ref.pop();
  const absolutePath = ref.join('.');
  modelName = `${absolutePath.replace(/\./g, '_')}::${modelName}`;
  ref.splice(ref.length - 1, 0, 'models');
  return _.get(leemons, `${absolutePath}.models.${modelName}`);
}

module.exports = { getModelLocation };
