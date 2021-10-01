const { add } = require('./add');
const { list } = require('./list');
const { exist } = require('./exist');
const { detail } = require('./detail');
const { update } = require('./update');
const { getCentersWithOutAssign } = require('./getCentersWithOutAssign');

module.exports = {
  add,
  list,
  exist,
  detail,
  update,
  getCentersWithOutAssign,
};
