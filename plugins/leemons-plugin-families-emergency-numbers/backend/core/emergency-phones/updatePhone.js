const { savePhoneDataset } = require('./savePhoneDataset');

async function updatePhone({ dataset, id, ctx, ...phone }) {
  const promises = [
    ctx.tx.db.EmergencyPhones.findOneAndUpdate({ id }, phone, { new: true, lean: true }),
  ];
  if (dataset) {
    promises.push(savePhoneDataset({ phone: id, values: dataset, ctx }));
  }

  const [phoneItem, datasetItem] = await Promise.all(promises);

  if (datasetItem) {
    phoneItem.dataset = datasetItem;
  }

  return phoneItem;
}

module.exports = { updatePhone };
