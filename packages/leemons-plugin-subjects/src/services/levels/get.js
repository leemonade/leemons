const getSessionPermissions = require('../permissions/getSessionPermissions');
const getEntity = require('./private/getEntity');

const table = leemons.query('plugins_subjects::levels');
const multilanguage = leemons.getPlugin('multilanguage')?.services.contents.getProvider();

module.exports = async function get(id, { userSession, locale = null, transacting } = {}) {
  const permissions = await getSessionPermissions({
    userSession,
    this: this,
    permissions: {
      view: leemons.plugin.config.constants.permissions.bundles.organization.view,
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
    // Get entity if exists
    const level = await getEntity(id, { transacting });
    if (!level) {
      throw new Error('Level not found');
    }

    // Parse properties
    level.properties = JSON.parse(level.properties);

    // Get localizations
    const key = leemons.plugin.prefixPN(`levels.${id}`);
    if (locale) {
      const name = await multilanguage.getValue(`${key}.name`, locale);
      const description = await multilanguage.getValue(`${key}.description`, locale);
      return { ...level, name, description };
    }
    const names = (
      await multilanguage.getWithKey(`${key}.name`, {
        transacting,
      })
    ).map(({ locale: _locale, value }) => ({ locale: _locale, value }));

    const descriptions = (
      await multilanguage.getWithKey(`${key}.description`, {
        transacting,
      })
    ).map(({ locale: _locale, value }) => ({ locale: _locale, value }));

    return { ...level, names, descriptions };
  }
  throw validator.error;
};
