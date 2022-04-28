const _ = require('lodash');
const { centers: getUserCenters } = require('./centers');
const { generateJWTToken } = require('./jwt/generateJWTToken');
const { table } = require('../tables');

async function centerProfileToken(user, centerId, profileId, { transacting } = {}) {
  const centers = await getUserCenters(user, { transacting });
  const center = _.find(centers, { id: centerId });
  if (!center) throw new Error('You dont have access to this center');
  const profile = _.find(center.profiles, { id: profileId });
  if (!profile) throw new Error('You dont have access to this profile');

  const userAgents = await table.userAgent.find({ user }, { columns: ['id', 'role'], transacting });

  const profileRoles = await table.profileRole.find(
    {
      profile: profile.id,
      role_$in: _.map(userAgents, 'role'),
    },
    { columns: ['role'], transacting }
  );

  const roleCenter = await table.roleCenter.findOne(
    { role_$in: _.map(profileRoles, 'role'), center: center.id },
    { transacting }
  );

  const userAgent = _.find(userAgents, { role: roleCenter.role });

  const promises = [generateJWTToken({ id: user }), generateJWTToken({ userAgent: userAgent.id })];

  const [userToken, useAgentToken] = await Promise.all(promises);

  return {
    userToken,
    centers: [
      {
        ...center,
        token: useAgentToken,
        userAgentId: userAgent.id,
      },
    ],
  };
}

module.exports = { centerProfileToken };
