const _ = require('lodash');
const { getUserAgentsInfo } = require('./getUserAgentsInfo');

async function getData({ locationName, ctx }) {
  const promises = [
    ctx.tx.call('dataset.dataset.getSchemaWithLocale', {
      locationName,
      pluginName: 'users',
      locale: ctx.meta.userSession.locale,
    }),
    ctx.tx.call('dataset.dataset.getValues', {
      locationName,
      pluginName: 'users',
      userAgent: ctx.meta.userSession.userAgents,
      target: ctx.meta.userSession.userAgents[0].id,
    }),
  ];

  const [{ compileJsonSchema, compileJsonUI }, value] = await Promise.all(promises);

  return { jsonSchema: compileJsonSchema, jsonUI: compileJsonUI, value };
}

async function getDataForUserAgentDatasets({ userAgentId, ctx }) {
  const locationNames = ['user-data'];
  let { userAgents } = ctx.meta.userSession;

  if (userAgentId) {
    userAgents = await getUserAgentsInfo({
      userAgentIds: [userAgentId],
      withProfile: false,
      withCenter: false,
      ctx,
    });
  }

  // Get the Profile based on the userAgent Role
  const [userAgent] = userAgents;
  const profileRoles = await ctx.tx.db.ProfileRole.find({ role: userAgent.role })
    .select(['id', 'profile'])
    .lean();

  profileRoles.forEach((profileRole) => {
    locationNames.push(`profile.${profileRole.profile}`);
  });

  const profiles = await ctx.db.Profiles.find({ id: _.map(profileRoles, 'profile') }).lean();

  // map profiles to an object with the locationName as key
  const profilesMap = {};
  _.forEach(profiles, (profile) => {
    profilesMap[`profile.${profile.id}`] = profile.name ?? profile.sysName;
  });

  return Promise.allSettled(
    _.map(locationNames, async (locationName) => {
      const data = await getData({
        locationName,
        ctx: {
          ...ctx,
          meta: {
            ...ctx.meta,
            userSession: {
              ...ctx.meta.userSession,
              userAgents: [userAgent],
            },
          },
        },
      });

      return {
        userAgent,
        data,
        locationName,
        title: profilesMap?.[locationName],
      };
    })
  ).then((results) =>
    results.filter((result) => result.status === 'fulfilled').map((result) => result.value)
  );
}

module.exports = { getDataForUserAgentDatasets };
