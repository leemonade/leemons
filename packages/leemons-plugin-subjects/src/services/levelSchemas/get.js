const getSessionPermissions = require('../permissions/getSessionPermissions');
const getEntity = require('./private/getEntity');

const levelSchemasTable = leemons.query('plugins_subjects::levelSchemas');
const multilanguage = leemons.getPlugin('multilanguage')?.services.contents.getProvider();

module.exports = async function get(id, { userSession, locale = null, transacting } = {}) {
  const permissions = await getSessionPermissions({
    userSession,
    this: this,
    permissions: {
      view: leemons.plugin.config.constants.permissions.bundles.tree.view,
    },
  });
  // TODO: Add better error message
  if (!permissions.view) {
    throw new Error('Permissions not satisfied');
  }
  const validator = new global.utils.LeemonsValidator({
    type: 'string',
    format: 'uuid',
  });

  if (validator.validate(id)) {
    return global.utils.withTransaction(
      async (t) => {
        // Get the entity if exists
        const levelSchema = await getEntity(id, { transacting: t });
        if (!levelSchema) {
          throw new Error('LevelSchema not found');
        }

        // Parse properties JSON
        levelSchema.properties = JSON.parse(levelSchema.properties);

        // Get the names
        const nameKey = leemons.plugin.prefixPN(`levelSchemas.${id}.name`);
        if (locale) {
          const name = await multilanguage.getValue(nameKey, locale);
          return { ...levelSchema, name };
        }
        const names = (
          await multilanguage.getWithKey(nameKey, {
            transacting: t,
          })
        ).map(({ locale: _locale, value }) => ({ locale: _locale, value }));

        return {
          ...levelSchema,
          names,
        };
      },
      levelSchemasTable,
      transacting
    );
  }
  throw validator.error;
};
