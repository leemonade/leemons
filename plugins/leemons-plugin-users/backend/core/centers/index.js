const add = require('./add');
const detail = require('./detail');
const existName = require('./existName');
const existsById = require('./existsById');
const { getByIds } = require('./getByIds');
const list = require('./list');
const remove = require('./remove');

module.exports = {
  add,
  list,
  detail,
  remove,
  existName,
  existsById,
  getByIds,
};
