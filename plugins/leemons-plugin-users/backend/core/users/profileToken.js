const _ = require('lodash');
const { LeemonsError } = require('leemons-error');
const { profiles: getUserProfiles } = require('./profiles');
const { generateJWTToken } = require('./jwt/generateJWTToken');

/**
 * Return profiles for active user
 * @public
 * @static
 * @param {string} user - User id
 * @param {string} profile - Profile id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */

async function profileToken({ user, profile, ctx }) {
  const profiles = await getUserProfiles({ user, ctx });
  const profil = _.find(profiles, { id: profile });
  if (!profil) throw new LeemonsError(ctx, { message: 'You do not have access to this profile.' });

  const userAgents = await ctx.tx.db.UserAgent.find({ user }).select(['id', 'role']).lean();

  const classes = await ctx.tx.call(
    'academic-portfolio.classes.listSessionClasses',
    {},
    { meta: { userSession: { userAgents } } }
  );

  const sessionConfig = {};
  if (classes && classes.length) {
    sessionConfig.program = classes[0].program;
  }

  const profileRoles = await ctx.tx.db.ProfileRole.find({
    profile,
    role: _.map(userAgents, 'role'),
  })
    .select(['role'])
    .lean();

  const rolesCenters = await ctx.tx.db.RoleCenter.find({
    role: _.map(profileRoles, 'role'),
  }).lean();

  const centers = await ctx.tx.db.Centers.find({ id: _.map(rolesCenters, 'center') })
    .select(['id', 'name', 'locale', 'uri'])
    .lean();

  const userAgentsByRole = _.keyBy(userAgents, 'role');
  const rolesCentersByCenter = _.keyBy(rolesCenters, 'center');

  const promises = [generateJWTToken({ payload: { sessionConfig, id: user }, ctx })];

  for (let i = 0, l = centers.length; i < l; i++) {
    promises.push(
      generateJWTToken({
        payload: {
          sessionConfig,
          userAgent: userAgentsByRole[rolesCentersByCenter[centers[i].id].role].id,
        },
        ctx,
      })
    );
  }

  const [userToken, ...centerTokens] = await Promise.all(promises);

  // SuperAdmin profile token
  let profilesTokens = [];
  if (!centerTokens || (centerTokens && _.isEmpty(centerTokens))) {
    profilesTokens = await Promise.all(
      profiles.map((item) =>
        generateJWTToken({
          payload: {
            userAgent: userAgentsByRole[item.role].id,
          },
          ctx,
        })
      )
    );
  }

  return {
    userToken,
    sessionConfig,
    centers: _.map(centers, (center, index) => ({
      ...center,
      token: centerTokens[index],
      userAgentId: userAgentsByRole[rolesCentersByCenter[centers[index].id].role].id,
    })),
    profiles: _.map(profiles, (item, index) => ({
      ...item,
      token: profilesTokens[index],
      userAgentId: userAgentsByRole[item.role]?.id,
    })),
  };
}

module.exports = { profileToken };
