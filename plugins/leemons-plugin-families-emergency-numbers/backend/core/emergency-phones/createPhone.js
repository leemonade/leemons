const { savePhoneDataset } = require('./savePhoneDataset');

async function createPhone({ dataset, ctx, ...phone }) {
  let phoneItem = await ctx.tx.db.EmergencyPhones.create(phone);
  phoneItem = phoneItem.toObject();

  if (dataset) {
    phoneItem.dataset = await savePhoneDataset({ phone: phoneItem.id, values: dataset, ctx });
  }

  return phoneItem;
}

module.exports = { createPhone };
