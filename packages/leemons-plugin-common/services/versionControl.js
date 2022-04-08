const create = require('../src/services/versionControl/currentVersions/create');
const get = require('../src/services/versionControl/currentVersions/get');
const remove = require('../src/services/versionControl/currentVersions/remove');
const update = require('../src/services/versionControl/currentVersions/update');
const { getVersion, publishVersion } = require('../src/services/versionControl/versions');
const removeVersionService = require('../src/services/versionControl/versions/removeVersionService');
const upgradeVersion = require('../src/services/versionControl/versions/upgradeVersion');

module.exports = {
  register: create,
  unregister: remove,
  getCurrentVersions: get,
  setCurrentVersion: update,

  getVersion,
  upgradeVersion,
  removeVersion: removeVersionService,
  publishVersion,
};
