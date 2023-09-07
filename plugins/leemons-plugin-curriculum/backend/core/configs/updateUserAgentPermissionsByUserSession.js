const _ = require('lodash');

async function updateUserAgentPermissionsByUserSession({ ctx }) {
  return ctx.tx.call('users.users.updateUserAgentPermissions', {
    userAgentIds: _.map(ctx.meta.userSession.userAgents, 'id'),
  });
}

module.exports = { updateUserAgentPermissionsByUserSession };
