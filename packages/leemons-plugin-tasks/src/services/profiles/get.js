const { profiles } = require('../table');

module.exports = async function get(key, { transacting } = {}) {
  const profile = await profiles.findOne({ key }, { transacting });

  if (!profile) {
    return null;
  }

  return profile.profile;
};
