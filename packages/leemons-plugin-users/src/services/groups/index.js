const { removeUser } = require('./removeUser');
const { addUserAgent } = require('./addUserAgent');
const { remove } = require('./remove');
const { exist } = require('./exist');
const { create } = require('./create');

module.exports = {
  exist,
  create,
  remove,
  addUserAgent,
  removeUser,
};
