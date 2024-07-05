async function validateSchemas(schemas, ctx, index = 0) {
  const entries = Object.entries(schemas);
  if (index >= entries.length) return false;

  const [locationName, schema] = entries[index];
  if (Object.keys(schema?.compileJsonSchema?.properties ?? {}).length) {
    const values = await ctx.tx.call('dataset.dataset.getValues', {
      locationName,
      pluginName: 'users',
      userAgent: ctx.meta.userSession.userAgents,
      target: ctx.meta.userSession.userAgents[0].id,
    });

    // Remove null values in order to validate the schema
    const goodValues = Object.fromEntries(
      Object.entries(values || {}).filter(([, item]) => !!item.value)
    );

    try {
      await ctx.tx.call('dataset.dataset.validateDataForJsonSchema', {
        jsonSchema: schema.compileJsonSchema,
        data: goodValues,
      });
    } catch (e) {
      return true;
    }
  }

  return validateSchemas(schemas, ctx, index + 1);
}

/**
 * Check if the user agent needs to update the dataset.
 *
 * This function interacts with the `leemons-plugin-dataset` plugin to:
 * 1. Fetch schemas for specific locations using `dataset.dataset.getSchemaWithLocale`.
 * 2. Validate the data against the fetched schemas using `dataset.dataset.validateDataForJsonSchema`.
 * 3. Retrieve dataset values using `dataset.dataset.getValues`.
 *
 * @param {Object} params - The parameters for the function.
 * @param {Object} params.ctx - The context object containing session and transaction information.
 * @returns {Promise<Boolean>} - Returns `true` if the dataset needs an update, otherwise `false`.
 */
async function userSessionUserAgentNeedUpdateDataset({ ctx }) {
  const locationNames = ['user-data'];

  // Get the Profile based on the userAgent Role
  const [userAgent] = ctx.meta.userSession.userAgents;
  const profileRoles = await ctx.tx.db.ProfileRole.find({ role: userAgent.role })
    .select(['id', 'profile'])
    .lean();

  profileRoles.forEach((profileRole) => {
    locationNames.push(`profile.${profileRole.profile}`);
  });

  const schemas = {};

  const schemaPromises = locationNames.map((locationName) =>
    ctx.tx
      .call('dataset.dataset.getSchemaWithLocale', {
        locationName,
        pluginName: 'users',
        locale: ctx.meta.userSession.locale,
      })
      .then((schema) => ({ locationName, schema }))
      .catch((e) => {
        ctx.logger.error(`Failed to get schema for ${locationName}: ${e}`);
        return null; // Return null to filter out later
      })
  );

  const schemaResults = await Promise.all(schemaPromises);
  schemaResults
    .filter((result) => result !== null)
    .forEach(({ locationName, schema }) => {
      schemas[locationName] = schema;
    });

  if (!Object.keys(schemas).length) {
    return false;
  }

  return validateSchemas(schemas, ctx);
}

module.exports = { userSessionUserAgentNeedUpdateDataset };
