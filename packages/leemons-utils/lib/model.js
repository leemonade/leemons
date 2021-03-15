const _ = require('lodash');

function getModelLocation(path, leemons) {
  const ref = path.split('.');
  ref.splice(ref.length - 1, 0, 'models');
  return _.get(leemons, ref.join('.'));
}

module.exports = { getModelLocation };
