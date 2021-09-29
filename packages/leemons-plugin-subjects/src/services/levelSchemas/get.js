const getSessionPermissions = require('../permissions/getSessionPermissions');

const tables = {
  levelSchemas: leemons.query('plugins_subjects::levelSchemas'),
};
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
    const levelSchema = await tables.levelSchemas.findOne({ id }, { transacting });
    if (!levelSchema) {
      throw new Error('LevelSchema not found');
    }
    levelSchema.properties = JSON.parse(levelSchema.properties);

    const nameKey = leemons.plugin.prefixPN(`levelSchemas.${id}.name`);
    if (locale) {
      const name = await multilanguage.getValue(nameKey, locale);
      return { ...levelSchema, name };
    }
    const names = (
      await multilanguage.getWithKey(nameKey, {
        transacting,
      })
    ).map(({ locale: _locale, value }) => ({ locale: _locale, value }));

    return {
      ...levelSchema,
      names,
    };
  }
  throw validator.error;
};
