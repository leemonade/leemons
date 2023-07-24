const _ = require('lodash');
const { getUserAgentPermissions } = require('../permissions/getUserAgentPermissions');

async function getBaseAllPermissionsQuery({ userAgentId: _userAgentId, ctx }) {
  const _userAgentIds = _.isArray(_userAgentId) ? _userAgentId : [_userAgentId];
  const userAgentIds = _.map(_userAgentIds, (uai) => (_.isString(uai) ? uai : uai.id));
  const userAgents = await ctx.tx.db.UserAgent.find({ id: userAgentIds });

  const permissions = await getUserAgentPermissions({ userAgent: userAgents, ctx });

  const query = {
    $or: [],
  };

  // ES: Preparación de la consulta para comprobar los permisos
  // EN: Preparation of the query to check permissions
  if (permissions.length) {
    _.forEach(permissions, (permission) => {
      query.$or.push({
        permissionName: permission.permissionName,
        actionName: permission.actionNames,
        target: permission.target,
      });
    });
  }

  return query;
}

module.exports = {
  getBaseAllPermissionsQuery,
};
