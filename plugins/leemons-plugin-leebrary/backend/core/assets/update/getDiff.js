const { defaults, cloneDeep, isEqual, differenceWith } = require('lodash');

function getDiff(a, b) {
  const _a = defaults(cloneDeep(a), b);

  if (isEqual(_a, b)) {
    return { object: _a, diff: [] };
  }

  return {
    object: _a,
    diff: differenceWith(Object.entries(_a), Object.entries(b), isEqual).map(([key]) => key),
  };
}

module.exports = { getDiff };
