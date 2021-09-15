const add = require('../src/services/levelSchemas/add');
const get = require('../src/services/levelSchemas/get');
const getNames = require('../src/services/levelSchemas/getNames');
const update = require('../src/services/levelSchemas/update');
const deleteLS = require('../src/services/levelSchemas/delete');
const list = require('../src/services/levelSchemas/list');
const setNames = require('../src/services/levelSchemas/setNames');
const setParent = require('../src/services/levelSchemas/setParent');
const setIsClass = require('../src/services/levelSchemas/setIsClass');
const addAssignables = require('../src/services/levelSchemas/addAssignables');
const removeAssignables = require('../src/services/levelSchemas/removeAssignables');

module.exports = {
  add,
  get,
  getNames,
  update,
  delete: deleteLS,
  list,
  setNames,
  setParent,
  setIsClass,
  addAssignables,
  removeAssignables,
};
