const { table } = require('../tables');

async function getCanEditProfiles({ transacting } = {}) {
  const result = await table.configs.findOne({ key: 'can-edit-profiles' }, { transacting });
  return result ? JSON.parse(result.value) : [];
}

module.exports = { getCanEditProfiles };
