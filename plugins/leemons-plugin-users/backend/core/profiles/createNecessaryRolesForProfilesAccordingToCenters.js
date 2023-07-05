const _ = require('lodash');

/**
 * Create all roles for profiles por all centers in platform
 * @public
 * @static
 * @param {Object} params
 * @param {MoleculerContext} params.ctx Moleculer context
 * @param {string | string[]} params.profileIds - Profile ids
 * @param {string | string[]} params.centerIds - Center ids
 * @param {any} _transacting - DB Transaction
 * @return {Promise<any>} Created permissions-roles
 * */
async function createNecessaryRolesForProfilesAccordingToCenters({ profileIds, centerIds, ctx }) {
  // ES: Si no vienen ids de perfiles sacamos todos los perfiles si vienen solo sacamos esos
  const queryProfile = {};
  if (profileIds) {
    queryProfile.id = _.isArray(profileIds) ? profileIds : [profileIds];
  }
  const queryCenters = {};
  if (centerIds) {
    queryCenters.id = _.isArray(centerIds) ? centerIds : [centerIds];
  }
  const [profiles, centers] = await Promise.all([
    ctx.tx.db.Profiles.find(queryProfile).select(['id']).lean(),
    ctx.tx.db.Centers.find(queryCenters).select(['id']).lean(),
  ]);

  const [centerRoles, profileRoles] = await Promise.all([
    ctx.tx.db.RoleCenter.find({ center: _.map(centers, 'id') }).lean(),
    ctx.tx.db.ProfileRole.find({ profile: _.map(profiles, 'id') }).lean(),
  ]);

  const profileRolesByProfile = _.groupBy(profileRoles, 'profile');

  const needToCreate = [];
  _.forEach(profiles, (profile) => {
    _.forEach(centers, (center) => {
      /*
       * ES: Si no hay perfiles por role significa que el perfil por el que iteramos aun no
       * tiene ningun rol creado, significa que siempre entrara al else y añadira n registros
       * segun n centros existan
       * */
      if (profileRolesByProfile[profile.id]) {
        /*
         * Si el perfil tiene roles tenemos que comprobar para cada centro si alguno de esos
         * roles ya esta en ese centro, si ninguno esta añadimos como que hay que crearlo
         * */
        let found = false;
        _.forEach(profileRolesByProfile[profile.id], ({ role }) => {
          if (_.findIndex(centerRoles, { center: center.id, role }) >= 0) {
            found = true;
            return false;
          }
        });
        if (!found) {
          needToCreate.push({ profile: profile.id, center: center.id });
        }
      } else {
        needToCreate.push({ profile: profile.id, center: center.id });
      }
    });
  });

  await Promise.all(
    _.map(needToCreate, ({ profile, center }) =>
      ctx.tx.call('users.roles.add', {
        name: `${profile}:${center}`,
        type: ctx.prefixPN('profile'),
        center,
        profile,
      })
    )
  );

  return true;
}

module.exports = createNecessaryRolesForProfilesAccordingToCenters;
