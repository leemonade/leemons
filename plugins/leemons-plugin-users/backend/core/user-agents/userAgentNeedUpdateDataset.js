async function userSessionUserAgentNeedUpdateDataset({ ctx }) {
  let schema;

  // TODO: locationName can be user-data or profile.lrn:local:users:local:6651f240c62b6014e69f78ae:Profiles:6651f24a0e1ea5ea378b8636, so we need to handle this cases
  const locationNames = ['user-data'];

  // Get the Profile based on the userAgent Role
  const [userAgent] = ctx.meta.userSession.userAgents;
  const profileRoles = await ctx.tx.db.ProfileRole.find({ role: userAgent.role })
    .select(['id', 'profile'])
    .lean();

  profileRoles.forEach((profileRole) => {
    locationNames.push(`profile.${profileRole.profile}`);
  });

  let schemas = [];

  try {
    schemas = await Promise.all(
      locationNames.map((locationName) =>
        ctx.tx.call('dataset.dataset.getSchemaWithLocale', {
          locationName,
          pluginName: 'users',
          locale: ctx.meta.userSession.locale,
        })
      )
    );

    schema = await ctx.tx.call('dataset.dataset.getSchemaWithLocale', {
      locationName: 'user-data',
      pluginName: 'users',
      locale: ctx.meta.userSession.locale,
    });
  } catch (e) {
    ctx.logger.error(e);
  }

  if (!schemas?.length) {
    return false;
  }

  if (Object.keys(schema?.compileJsonSchema?.properties ?? {}).length) {
    const values = await ctx.tx.call('dataset.dataset.getValues', {
      locationName: 'user-data',
      pluginName: 'users',
      userAgent: ctx.meta.userSession.userAgents,
      target: ctx.meta.userSession.userAgents[0].id,
    });

    try {
      await ctx.tx.call('dataset.dataset.validateDataForJsonSchema', {
        jsonSchema: schema.compileJsonSchema,
        data: values || {},
      });
    } catch (e) {
      return true;
    }
  }

  return false;
}

module.exports = { userSessionUserAgentNeedUpdateDataset };
