const add = require('../src/services/levels/add');
const get = require('../src/services/levels/get');
const deleteLS = require('../src/services/levels/delete');
const list = require('../src/services/levels/list');
const setNames = require('../src/services/levels/setNames');
const setDescriptions = require('../src/services/levels/setDescriptions');
const setParent = require('../src/services/levels/setParent');
const hasValidSchemaAndParent = require('../src/services/levels/hasValidSchemaAndParent');

module.exports = {
  add,
  get,
  delete: deleteLS,
  list,
  setNames,
  setDescriptions,
  setParent,
  hasValidSchemaAndParent,
};
