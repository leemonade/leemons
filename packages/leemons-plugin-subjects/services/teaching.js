// Items
const createItem = require('../src/services/teaching/items/create');
const existsItem = require('../src/services/teaching/items/exists');
const getItem = require('../src/services/teaching/items/get');
const listItem = require('../src/services/teaching/items/list');
const updateItem = require('../src/services/teaching/items/update');
const removeItem = require('../src/services/teaching/items/delete');

// Assignments
// const create = require('../src/services/teaching/items/create');
// const exists = require('../src/services/teaching/items/exists');
// const get = require('../src/services/teaching/items/get');
// const list = require('../src/services/teaching/items/list');
// const update = require('../src/services/teaching/items/update');
// const remove = require('../src/services/teaching/items/delete');

module.exports = {
  // Items
  createItem,
  existsItem,
  getItem,
  listItem,
  updateItem,
  deleteItem: removeItem,

  // Assignments
};
