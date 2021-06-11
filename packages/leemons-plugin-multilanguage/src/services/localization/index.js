const { add, addMany, addManyByKey } = require('./create');
const { get, getMany } = require('./read');
const { setName } = require('./update');
const { delete: deleteOne, deleteMany } = require('./delete');
const { has, hasMany } = require('./has');

module.exports = {
  add,
  addMany,
  addManyByKey,

  get,
  getMany,

  setName,

  delete: deleteOne,
  deleteMany,

  has,
  hasMany,
};
