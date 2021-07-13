const { list } = require('./list');
const { add } = require('./add');
const { existName } = require('./existName');
const { detailByUri } = require('./detailByUri');
const { update } = require('./update');
const existMany = require('./existMany');

module.exports = {
  list,
  add,
  existName,
  detailByUri,
  update,
  existMany,
};
