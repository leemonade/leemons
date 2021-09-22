const add = require('../src/services/levels/add');
const get = require('../src/services/levels/get');
const deleteLS = require('../src/services/levels/delete');
const update = require('../src/services/levels/update');
const list = require('../src/services/levels/list');
const setNames = require('../src/services/levels/setNames');
const setDescriptions = require('../src/services/levels/setDescriptions');
const setParent = require('../src/services/levels/setParent');
const hasValidSchemaAndParent = require('../src/services/levels/hasValidSchemaAndParent');
const setPermissions = require('../src/services/levels/setPermissions.js');
const addUsers = require('../src/services/levels/addUsers');
const removeUsers = require('../src/services/levels/removeUsers');
const getUsers = require('../src/services/levels/getUsers');

module.exports = {
  add,
  get,
  delete: deleteLS,
  update,
  list,
  setNames,
  setDescriptions,
  setParent,
  hasValidSchemaAndParent,
  setPermissions,
  addUsers,
  removeUsers,
  getUsers,
};
