const _ = require('lodash');
const { table } = require('../tables');
const { savePhoneDataset } = require('./savePhoneDataset');

async function updatePhone({ dataset, id, ...phone }, userSession, { transacting } = {}) {
  const promises = [table.emergencyPhones.update({ id }, phone, { transacting })];
  if (dataset) {
    promises.push(savePhoneDataset(id, dataset, userSession, { transacting }));
  }

  const [phoneItem, datasetItem] = await Promise.all(promises);

  if (datasetItem) {
    phoneItem.dataset = datasetItem;
  }

  return phoneItem;
}

module.exports = { updatePhone };
