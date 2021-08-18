const { add } = require('./add');
const { find } = require('./find');
const { count } = require('./count');
const { exist } = require('./exist');
const { remove } = require('./remove');
const { addBasicIfNeed } = require('./addBasicIfNeed');

module.exports = {
  add,
  find,
  count,
  exist,
  remove,
  addBasicIfNeed,
};
