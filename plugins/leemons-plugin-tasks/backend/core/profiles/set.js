const { profiles } = require('../table');

module.exports = async function set(key, profile, { transacting } = {}) {
  await profiles.set({ key }, { profile }, { transacting });

  return true;
};
