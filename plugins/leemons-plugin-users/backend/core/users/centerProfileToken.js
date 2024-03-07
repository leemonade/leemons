const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { centers: getUserCenters } = require('./centers');
const { generateJWTToken } = require('./jwt/generateJWTToken');

async function centerProfileToken({ user, centerId, profileId, ctx }) {
  const centers = await getUserCenters({ user, ctx });
  const center = _.find(centers, { id: centerId });
  if (!center) throw new LeemonsError(ctx, { message: 'You dont have access to this center' });
  const profile = _.find(center.profiles, { id: profileId });
  if (!profile) throw new LeemonsError(ctx, { message: 'You dont have access to this profile' });

  const userAgents = await ctx.tx.db.UserAgent.find({
    user,
    $or: [{ disabled: null }, { disabled: false }],
  })
    .select(['id', 'role'])
    .lean();

  const classes = await ctx.tx.call(
    'academic-portfolio.classes.listSessionClasses',
    {},
    {
      meta: { userSession: { userAgents } },
    }
  );

  const sessionConfig = {};
  if (classes && classes.length) {
    sessionConfig.program = classes[0].program;
  }

  const profileRoles = await ctx.tx.db.ProfileRole.find({
    profile: profile.id,
    role: _.map(userAgents, 'role'),
  })
    .select(['role'])
    .lean();

  const roleCenter = await ctx.tx.db.RoleCenter.findOne({
    role: _.map(profileRoles, 'role'),
    center: center.id,
  }).lean();

  const userAgent = _.find(userAgents, { role: roleCenter.role });

  if (userAgent) {
    const promises = [
      generateJWTToken({ payload: { sessionConfig, id: user }, ctx }),
      generateJWTToken({
        payload: {
          sessionConfig,
          userAgent: userAgent.id,
        },
        ctx,
      }),
    ];

    const [userToken, useAgentToken] = await Promise.all(promises);

    return {
      userToken,
      sessionConfig,
      centers: [
        {
          ...center,
          token: useAgentToken,
          userAgentId: userAgent.id,
        },
      ],
    };
  }
  throw new LeemonsError(ctx, { message: 'User agent not found, or disabled' });
}

module.exports = { centerProfileToken };
