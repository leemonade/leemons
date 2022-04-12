const versionControl = require('../versionControl');
const removeAssignables = require('./removeAssignables');

module.exports = async function removeAssignable(assignable, { removeAll = 2, transacting } = {}) {
  const version = await versionControl.getVersion(assignable, { transacting });

  const isPublished = version.published;

  if (removeAll === 0) {
    return removeAssignables([assignable], { transacting });
  }

  if (removeAll === 1 || removeAll === 2) {
    const versions = (
      await versionControl.listVersions(assignable, {
        published: removeAll === 1 ? isPublished : 'all',
        transacting,
      })
    ).map((v) => v.fullId);

    return removeAssignables(versions, { transacting });
  }

  throw new Error('Invalid removeAll value');
};
