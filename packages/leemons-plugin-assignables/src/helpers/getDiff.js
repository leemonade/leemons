const _ = require('lodash');

module.exports = function getDiff(a, b) {
  const _a = _.defaults(_.cloneDeep(a), b);

  if (_.isEqual(_a, b)) {
    return { object: _a, diff: [] };
  }

  return {
    object: _a,
    diff: _.map(_.differenceWith(_.entries(_a), _.entries(b), _.isEqual), _.head),
  };
};
