const _ = require('lodash');
const { existUserAgent } = require('../existUserAgent');
const { permissionsNamespace } = require('../../../helpers/cacheKeys');

async function _updateUserAgentPermissions({ userAgentId, ctx }) {
  await existUserAgent({ query: { id: userAgentId }, throwErrorIfNotExists: true, ctx });

  // ES: Borramos los permisos que salieran desde roles y sacamos todos los roles actuales del usuario, ya sea por que vienen desde grupos/perfiles/o el mismo rol que tiene
  const [groupUserAgent, userAgent] = await Promise.all([
    ctx.tx.db.GroupUserAgent.find({ userAgent: userAgentId }).select(['id', 'group']).lean(),
    ctx.tx.db.UserAgent.findByIdAndUpdate(userAgentId, { reloadPermissions: false }),
    ctx.tx.db.UserAgentPermission.deleteMany({
      userAgent: userAgentId,
      role: {
        $ne: null,
      },
    }),
  ]);

  // ES: Sacamos los roles de los grupos y los perfiles a los que pertenezca el usuario
  const [groupRoles, profileRoles] = await Promise.all([
    ctx.tx.db.GroupRole.find({ group: _.map(groupUserAgent, 'group') })
      .select(['id', 'role'])
      .lean(),
    ctx.tx.db.ProfileRole.find({ role: userAgent.role }).select(['id', 'profile']).lean(),
  ]);
  const profileIds = _.map(profileRoles, 'profile');
  const [profiles, userProfiles] = await Promise.all([
    ctx.tx.db.Profiles.find({ id: profileIds }).select(['id', 'role']).lean(),
    ctx.tx.db.UserProfile.find({ profile: profileIds, user: userAgent.user })
      .select(['id', 'role'])
      .lean(),
  ]);

  const roleIds = _.uniq(
    [userAgent.role]
      .concat(_.map(groupRoles, 'role'))
      .concat(_.map(profiles, 'role'))
      .concat(_.map(userProfiles, 'role'))
  );

  const [rolePermissions, roleCenter] = await Promise.all([
    ctx.tx.db.RolePermission.find({ role: roleIds }).lean(),
    ctx.tx.db.RoleCenter.find({ role: roleIds }).lean(),
  ]);

  const roleCenterByRole = _.keyBy(roleCenter, 'role');
  return ctx.tx.db.UserAgentPermission.insertMany(
    _.map(rolePermissions, (rolePermission) => ({
      userAgent: userAgentId,
      role: rolePermission.role,
      permissionName: rolePermission.permissionName,
      actionName: rolePermission.actionName,
      target: rolePermission.target,
      center: roleCenterByRole[rolePermission.role]
        ? roleCenterByRole[rolePermission.role].center
        : null,
    }))
  );
}

/**
 * EN:
 * Updates the permissions of the user if it is marked as reload permissions according to their
 * roles and the roles of the groups to which they belong.
 *
 * ES:
 * Borra todos los permisos que ya tuviera el usuario que vinieran desde un rol y vuelve a generar
 * todos los permisos desde los roles en los que esta el usuario
 *
 * @public
 * @static
 * @param {string | string[]} userAgentId - User auth id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function updateUserAgentPermissions({ userAgentIds, ctx }) {
  if (_.isArray(userAgentIds)) {
    const results = [];
    for (let i = 0, l = userAgentIds.length; i < l; i++) {
      // eslint-disable-next-line no-await-in-loop
      results.push(await _updateUserAgentPermissions({ userAgentId: userAgentIds[i], ctx }));
    }
    await Promise.all(
      _.map(userAgentIds, (_userAgent) =>
        ctx.cache.deleteByNamespace(
          permissionsNamespace,
          (key) =>
            key.startsWith(
              `${permissionsNamespace}:${ctx.meta.deploymentID}:${_userAgent?.id ?? _userAgent}`
            ) ?? true
        )
      )
    );
    return results;
  }

  return _updateUserAgentPermissions({ userAgentId: userAgentIds, ctx });
}

module.exports = { updateUserAgentPermissions };
