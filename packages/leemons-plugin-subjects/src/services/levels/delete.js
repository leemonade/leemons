const getSessionPermissions = require('../permissions/getSessionPermissions');
const deleteEntity = require('./private/deleteEntity');
const findEntity = require('./private/findEntity');

const table = leemons.query('plugins_subjects::levels');
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
    return global.utils.withTransaction(async (t) => {
      // Check if entity exists
      if (!(await findEntity({ id }, { count: true, transacting: t }))) {
        throw new Error('Level not found');
      }

      // Check if level has children
      if (await findEntity({ parent: id }, { count: true, transacting: t })) {
        throw new Error("Can't delete a Level with children");
      }

      // Delete localizations
      await multilanguage.deleteKeyStartsWith(leemons.plugin.prefixPN(`levels.${id}`), {
        transacting: t,
      });

      // Delete entity
      await deleteEntity(id, { transacting: t });

      return true;
    });
  }
  throw validator.error;
};
