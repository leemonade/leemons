const versionControl = require('../versionControl');

module.exports = async function publishAssignable(assignable, { transacting }) {
  await versionControl.publishVersion(assignable, true, { setAsCurrent: true, transacting });

  return true;
};
