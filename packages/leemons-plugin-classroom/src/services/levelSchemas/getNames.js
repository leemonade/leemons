const getSessionPermissions = require('../permissions/getSessionPermissions');

const tables = {
  levelSchemas: leemons.query('plugins_classroom::levelSchemas'),
  assignableProfiles: leemons.query('plugins_classroom::levelSchemas_profiles'),
};
const multilanguage = leemons.getPlugin('multilanguage')?.services.contents.getProvider();

module.exports = async function getNames(id, { userSession, transacting } = {}) {
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
    const nameKey = leemons.plugin.prefixPN(`levelSchemas.${id}.name`);

    const names = (
      await multilanguage.getWithKey(nameKey, {
        transacting,
      })
    ).map(({ locale: _locale, value }) => ({ locale: _locale, value }));

    return { id, names };
  }
  throw validator.error;
};
