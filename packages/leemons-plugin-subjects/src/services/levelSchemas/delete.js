const getSessionPermissions = require('../permissions/getSessionPermissions');
const deleteEntity = require('./private/deleteEntity');
const findEntity = require('./private/findEntity');

const levelSchemasTable = leemons.query('plugins_subjects::levelSchemas');
const multilanguage = leemons.getPlugin('multilanguage')?.services.contents.getProvider();

module.exports = async function get(id, { userSession, transacting } = {}) {
  const permissions = await getSessionPermissions({
    userSession,
    this: this,
    permissions: {
      delete: leemons.plugin.config.constants.permissions.bundles.tree.delete,
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
    return global.utils.withTransaction(
      async (t) => {
        // Check if entity exists
        if (!(await findEntity({ id }, { count: true, transacting: t }))) {
          throw new Error('LevelSchema not found');
        }

        // Check if it has children
        if (await findEntity({ parent: id }, { count: true, transacting: t })) {
          throw new Error("Can't delete a LevelSchema with children");
        }

        // Delete localizations
        await multilanguage.deleteAll(
          { key: leemons.plugin.prefixPN(`levelSchemas.${id}.name`) },
          { transacting: t }
        );
        return deleteEntity({ id }, { transacting: t });
      },
      levelSchemasTable,
      transacting
    );
  }
  throw validator.error;
};
