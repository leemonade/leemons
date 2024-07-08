const _ = require('lodash');

async function getData({ userAgent, locationName, ctx }) {
  const [{ compileJsonSchema, compileJsonUI }, value] = await Promise.all([
    ctx.tx.call('dataset.dataset.getSchemaWithLocale', {
      locationName,
      pluginName: 'users',
      locale: ctx.meta.userSession.locale,
    }),
    ctx.tx.call('dataset.dataset.getValues', {
      locationName,
      pluginName: 'users',
      userAgent: [userAgent],
      target: userAgent.id,
    }),
  ]);

  return { jsonSchema: compileJsonSchema, jsonUI: compileJsonUI, value };
}

async function getUserDatasetInfo({ userAgent, ctx }) {
  const locationNames = ['user-data'];

  // Get the Profile based on the userAgent Role
  const profileRoles = await ctx.tx.db.ProfileRole.find({ role: userAgent.role })
    .select(['id', 'profile'])
    .lean();

  profileRoles.forEach((profileRole) => {
    locationNames.push(`profile.${profileRole.profile}`);
  });

  return Promise.allSettled(
    _.map(locationNames, async (locationName) => {
      const data = await getData({
        userAgent,
        locationName,
        ctx,
      });

      return {
        data,
        locationName,
      };
    })
  ).then((results) =>
    results.filter((result) => result.status === 'fulfilled').map((result) => result.value)
  );
}

module.exports = { getUserDatasetInfo };
