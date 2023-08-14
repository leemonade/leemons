const _ = require('lodash');
const { table } = require('../tables');
const { removePhoneDataset } = require('./removePhoneDataset');

async function removePhone({ id }, { transacting } = {}) {
  return await Promise.all([
    table.emergencyPhones.delete({ id }, { transacting }),
    removePhoneDataset(id, { transacting }),
  ]);
}

module.exports = { removePhone };
