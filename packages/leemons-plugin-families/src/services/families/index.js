const { add } = require('./add');
const { list } = require('./list');
const { detail } = require('./detail');
const { update } = require('./update');
const { remove } = require('./remove');
const { getMembers } = require('./getMembers');
const { listDetailPage } = require('./listDetailPage');

module.exports = {
  add,
  list,
  detail,
  update,
  remove,
  getMembers,
  listDetailPage,
};
