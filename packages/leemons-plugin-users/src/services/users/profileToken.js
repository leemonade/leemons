const _ = require('lodash');
const getUserProfiles = require('./profiles');
const { generateJWTToken } = require('./generateJWTToken');
const { table } = require('../tables');

/**
 * Return profiles for active user
 * @public
 * @static
 * @param {string} user - User id
 * @param {string} profile - Profile id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function profileToken(user, profile, { transacting } = {}) {
  const profiles = await getUserProfiles(user, { transacting });
  const profil = _.find(profiles, { id: profile });
  if (!profil) throw new Error('Yu dont have access to this profile');

  const userAgents = await table.userAgent.find({ user }, { columns: ['id', 'role'], transacting });

  const profileRoles = await table.profileRole.find(
    {
      profile,
      role_$in: _.map(userAgents, 'role'),
    },
    { columns: ['role'], transacting }
  );

  const rolesCenters = await table.roleCenter.find(
    { role_$in: _.map(profileRoles, 'role') },
    { transacting }
  );

  const centers = await table.centers.find(
    { id_$in: _.map(rolesCenters, 'center') },
    {
      columns: ['id', 'name', 'locale', 'uri'],
      transacting,
    }
  );

  const userAgentsByRole = _.keyBy(userAgents, 'role');
  const rolesCentersByCenter = _.keyBy(rolesCenters, 'center');

  const promises = [generateJWTToken({ id: user })];

  for (let i = 0, l = centers.length; i < l; i++) {
    promises.push(
      generateJWTToken({ userAgent: userAgentsByRole[rolesCentersByCenter[centers[i].id].role].id })
    );
  }

  const [userToken, ...centerTokens] = await Promise.all(promises);

  return {
    userToken: userToken,
    centers: _.map(centers, (center, index) => ({
      ...center,
      token: centerTokens[index],
    })),
  };
}

module.exports = profileToken;
