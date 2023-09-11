const { defaults, cloneDeep, isEqual, differenceWith } = require('lodash');

/**
 * @module getDiff
 * @description This module provides a function to get the difference between two objects.
 * @param {Object} a - The first object to compare.
 * @param {Object} b - The second object to compare.
 * @returns {Object} An object containing the original object and the difference between the two objects.
 */
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
