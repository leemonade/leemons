const _ = require('lodash');
const { removePhoneDataset } = require('./removePhoneDataset');

async function removePhone({ id, ctx }) {
  return Promise.all([
    ctx.tx.db.EmergencyPhones.deleteOne({ id }),
    removePhoneDataset({ phone: id, ctx }),
  ]);
}

module.exports = { removePhone };
