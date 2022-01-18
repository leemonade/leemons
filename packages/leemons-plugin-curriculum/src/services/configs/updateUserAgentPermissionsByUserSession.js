const _ = require('lodash');

async function updateUserAgentPermissionsByUserSession(userSession, { transacting } = {}) {
  return leemons
    .getPlugin('users')
    .services.users.updateUserAgentPermissions(_.map(userSession.userAgents, 'id'), {
      transacting,
    });
}

module.exports = { updateUserAgentPermissionsByUserSession };
