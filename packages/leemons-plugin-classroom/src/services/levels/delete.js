const getSessionPermissions = require('../permissions/getSessionPermissions');

const table = leemons.query('plugins_classroom::levels');
const multilanguage = leemons.getPlugin('multilanguage')?.services.contents.getProvider();

module.exports = async function deleteOne(id, { userSession, transacting } = {}) {
  const permissions = await getSessionPermissions({
    userSession,
    this: this,
    permissions: {
      delete: leemons.plugin.config.constants.permissions.bundles.organization.delete,
    },
  });

  // TODO: Add better error message
  if (!permissions.delete) {
    throw new Error('Permissions not satisfied');
  }
  const validator = new global.utils.LeemonsValidator({
    type: 'string',
    format: 'uuid',
  });

  if (validator.validate(id)) {
    const level = await table.findOne({ id }, { transacting });
    if (!level) {
      throw new Error('Level not found');
    }

    if ((await table.count({ parent: id }, { transacting })) > 0) {
      throw new Error("Can't delete a Level with children");
    }

    await leemons.plugin.services.levels.removeUsers({ users: 'all', level: id });

    await multilanguage.deleteKeyStartsWith(leemons.plugin.prefixPN(`levels.${id}`), {
      transacting,
    });

    await table.delete({ id }, { transacting });

    return true;
  }
  throw validator.error;
};
