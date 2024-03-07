const getSystemDataFieldsConfig = require('./getSystemDataFieldsConfig');
const { validateSaveSystemDataFieldsConfig } = require('../../validations/item-permissions');

async function saveSystemDataFieldsConfig({ ctx, ...data }) {
  validateSaveSystemDataFieldsConfig(data);
  await ctx.tx.db.Config.updateOne(
    { key: 'SystemDataFields' },
    {
      key: 'SystemDataFields',
      value: JSON.stringify(data),
    },
    { upsert: true }
  );
  return getSystemDataFieldsConfig({ ctx });
}

module.exports = saveSystemDataFieldsConfig;
