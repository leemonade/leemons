const { map, find } = require('lodash');
const semver = require('semver');
/**
 * Get the last version of an assignable
 * @function getAssignableLastVersion
 * @param {Array<Object>} groupedAssignables - The grouped assignables to process.
 * @returns {Array<string>} The last versions of each assignable.
 */

function getAssignableLastVersion(groupedAssignables) {
  return map(groupedAssignables, (values) => {
    const versions = map(values, (id) => id.version);

    const latest = semver.maxSatisfying(versions, '*');

    return find(values, (id) => id.version === latest).fullId;
  });
}

module.exports = {
  getAssignableLastVersion,
};
