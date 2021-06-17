const { add, addMany } = require('./create');
const { get, getMany, getAll } = require('./read');
const { setName } = require('./update');
const { delete: deleteOne, deleteMany } = require('./delete');
const { has, hasMany } = require('./has');

module.exports = {
  add,
  addMany,

  get,
  getMany,
  getAll,

  setName,

  delete: deleteOne,
  deleteMany,

  has,
  hasMany,
};
