const { table } = require('../tables');
const getSystemDataFieldsConfig = require('./getSystemDataFieldsConfig');
const { validateSaveSystemDataFieldsConfig } = require('../../validations/item-permissions');

async function saveSystemDataFieldsConfig(data, { transacting } = {}) {
  validateSaveSystemDataFieldsConfig(data);
  await table.config.set(
    { key: 'SystemDataFields' },
    {
      key: 'SystemDataFields',
      value: JSON.stringify(data),
    },
    {
      transacting,
    }
  );
  return getSystemDataFieldsConfig({ transacting });
}

module.exports = saveSystemDataFieldsConfig;
