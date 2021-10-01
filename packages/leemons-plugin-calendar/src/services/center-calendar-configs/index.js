const { addMany } = require('./addMany');
const { getByCenterId } = require('./getByCenterId');
const { listByConfigId } = require('./listByConfigId');
const { removeByConfigId } = require('./removeByConfigId');

module.exports = {
  addMany,
  getByCenterId,
  listByConfigId,
  removeByConfigId,
};
