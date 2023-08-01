const _ = require('lodash');
const { getProfiles } = require('../src/services/settings/getProfiles');

module.exports = {
  getProfiles,
  userSessionIsAcademic: async (userSession, { transacting } = {}) => {
    const [profiles, userAgents] = await Promise.all([
      getProfiles({ transacting }),
      leemons
        .getPlugin('users')
        .services.users.getUserAgentsInfo(_.map(userSession.userAgents, 'id'), {
          withProfile: true,
          transacting,
        }),
    ]);

    const profileIds = _.map(userAgents, 'profile.id');
    return profileIds.includes(profiles.teacher) || profileIds.includes(profiles.student);
  },
  userSessionIsStudent: async (userSession, { transacting } = {}) => {
    const [profiles, userAgents] = await Promise.all([
      getProfiles({ transacting }),
      leemons
        .getPlugin('users')
        .services.users.getUserAgentsInfo(_.map(userSession.userAgents, 'id'), {
          withProfile: true,
          transacting,
        }),
    ]);

    const profileIds = _.map(userAgents, 'profile.id');
    return profileIds.includes(profiles.student);
  },
};
