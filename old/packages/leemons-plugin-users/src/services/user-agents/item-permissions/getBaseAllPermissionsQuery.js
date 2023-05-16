const _ = require('lodash');
const { table } = require('../../tables');
const { getUserAgentPermissions } = require('../permissions/getUserAgentPermissions');

async function getBaseAllPermissionsQuery(_userAgentId, { transacting } = {}) {
  const _userAgentIds = _.isArray(_userAgentId) ? _userAgentId : [_userAgentId];
  const userAgentIds = _.map(_userAgentIds, (_userAgentId) => {
    return _.isString(_userAgentId) ? _userAgentId : _userAgentId.id;
  });
  const userAgents = await table.userAgent.find({ id_$in: userAgentIds }, { transacting });

  const permissions = await getUserAgentPermissions(userAgents, {
    transacting,
  });

  const query = {
    $or: [],
  };

  // ES: Preparación de la consulta para comprobar los permisos
  // EN: Preparation of the query to check permissions
  if (permissions.length) {
    _.forEach(permissions, (permission) => {
      query.$or.push({
        permissionName: permission.permissionName,
        actionName_$in: permission.actionNames,
        target: permission.target,
      });
    });
  }

  return query;
}

module.exports = {
  getBaseAllPermissionsQuery,
};
