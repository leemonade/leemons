const { add, addMany, addManyByKey } = require('./create');
const {
  get,
  getManyWithLocale,
  getWithKey,
  getKeyValueWithLocale,
  getWithLocale,
  getKeyStartsWith,
  getKeyValueStartsWith,
} = require('./read');
const { countKeyStartsWith, countLocalesWithKey } = require('./count');
const { setValue, setKey, setMany } = require('./update');
const { delete: deleteOne, deleteMany, deleteAll, deleteKeyStartsWith } = require('./delete');
const { has, hasMany } = require('./has');

module.exports = {
  add,
  addMany,
  addManyByKey,

  get,
  getManyWithLocale,
  getWithKey,
  getKeyValueWithLocale,
  getWithLocale,
  getKeyStartsWith,
  getKeyValueStartsWith,

  countKeyStartsWith,
  countLocalesWithKey,

  setValue,
  setKey,

  delete: deleteOne,
  deleteMany,
  deleteAll,
  deleteKeyStartsWith,

  has,
  hasMany,
  setMany,
};
