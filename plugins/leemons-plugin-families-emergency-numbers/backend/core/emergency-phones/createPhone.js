const _ = require('lodash');
const { table } = require('../tables');
const { savePhoneDataset } = require('./savePhoneDataset');

async function createPhone({ dataset, ...phone }, userSession, { transacting } = {}) {
  const phoneItem = await table.emergencyPhones.create(phone, { transacting });

  if (dataset) {
    phoneItem.dataset = await savePhoneDataset(phoneItem.id, dataset, userSession, { transacting });
  }

  return phoneItem;
}

module.exports = { createPhone };
