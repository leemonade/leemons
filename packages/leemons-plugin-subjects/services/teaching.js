// Items
const createItem = require('../src/services/teaching/items/create');
const existsItem = require('../src/services/teaching/items/exists');
const getItem = require('../src/services/teaching/items/get');
const listItem = require('../src/services/teaching/items/list');
const updateItem = require('../src/services/teaching/items/update');
const removeItem = require('../src/services/teaching/items/delete');

// Assignments
const add = require('../src/services/teaching/add');
// const exists = require('../src/services/teaching/exists');
// const get = require('../src/services/teaching/get');
// const list = require('../src/services/teaching/list');
// const update = require('../src/services/teaching/update');
// const remove = require('../src/services/teaching/delete');

module.exports = {
  // Items
  createItem,
  existsItem,
  getItem,
  listItem,
  updateItem,
  deleteItem: removeItem,

  // Assignments
  add,
};
