const create = require('../src/services/versionControl/currentVersions/create');
const get = require('../src/services/versionControl/currentVersions/get');
const list = require('../src/services/versionControl/currentVersions/list');
const remove = require('../src/services/versionControl/currentVersions/remove');
const update = require('../src/services/versionControl/currentVersions/update');
const helpers = require('../src/services/versionControl/helpers');
const { getVersion, publishVersion } = require('../src/services/versionControl/versions');
const listVersionsOfType = require('../src/services/versionControl/versions/listVersionOfType');
const listVersions = require('../src/services/versionControl/versions/listVersions');
const removeVersionService = require('../src/services/versionControl/versions/removeVersionService');
const upgradeVersion = require('../src/services/versionControl/versions/upgradeVersion');

module.exports = {
  register: create,
  unregister: remove,
  getCurrentVersions: get,
  setCurrentVersion: update,
  list,

  getVersion,
  upgradeVersion,
  removeVersion: removeVersionService,
  publishVersion,
  listVersions,
  listVersionsOfType,

  ...helpers,
};
