const { addUserToAssignable } = require('./addUserToAssignable');
const { findAssignableByAssetIds } = require('./findAssignableByAssetIds');
const { getAssignablesAssets } = require('./getAssignablesAssets');
const { publishAssignable } = require('./publishAssignable');
const { removeUserFromAssignable } = require('./removeUserFromAssignable');
const { createAssignable } = require('./createAssignable');
const { getAssignable } = require('./getAssignable');
const { removeAssignable } = require('./removeAssignable');
const { searchAssignables } = require('./searchAssignables');
const { duplicateAssignable } = require('./duplicateAssignable');
const { getAssignables } = require('./getAssignables');
const { listAssignableUserAgents } = require('./listAssignableUserAgents');
const { removeAssignables } = require('./removeAssignables');
const { updateAssignable } = require('./updateAssignable');

module.exports = {
  addUserToAssignable,
  findAssignableByAssetIds,
  getAssignablesAssets,
  publishAssignable,
  removeUserFromAssignable,
  createAssignable,
  getAssignable,
  removeAssignable,
  searchAssignables,
  duplicateAssignable,
  getAssignables,
  listAssignableUserAgents,
  removeAssignables,
  updateAssignable,
};
