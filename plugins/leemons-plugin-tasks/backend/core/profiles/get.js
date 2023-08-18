const { profiles } = require('../table');

module.exports = async function get(key, { transacting } = {}) {
  const profile = await profiles.findOne({ key }, { transacting });

  if (!profile) {
    const p = await leemons
      .getPlugin('academic-portfolio')
      .services.settings.getProfiles({ transacting });

    return p[key];
  }

  return profile.profile;
};
