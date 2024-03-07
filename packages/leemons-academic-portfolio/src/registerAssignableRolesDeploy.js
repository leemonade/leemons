const { hasKey, setKey } = require('@leemons/mongodb-helpers');
const _ = require('lodash');

async function registerAssignableRolesDeploy({ keyValueModel, assignableRoles, ctx }) {
  if (!(await hasKey(keyValueModel, 'init-assignables'))) {
    await Promise.allSettled(
      _.map(assignableRoles, (role) =>
        ctx.tx.call('assignables.roles.registerRole', {
          role: role.role,
          ...role.options,
        })
      )
    );
    await setKey(keyValueModel, 'init-assignables');
  }
}

module.exports = { registerAssignableRolesDeploy };
