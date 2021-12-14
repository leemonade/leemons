const { table } = require('../tables');

async function setCanEditProfiles(profiles, { transacting } = {}) {
  return table.configs.set(
    { key: 'can-edit-profiles' },
    { key: 'can-edit-profiles', value: JSON.stringify(profiles) },
    { transacting }
  );
}

module.exports = { setCanEditProfiles };
