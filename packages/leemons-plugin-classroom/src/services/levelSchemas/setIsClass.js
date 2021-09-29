const getSessionPermissions = require('../permissions/getSessionPermissions');

const levelSchemas = leemons.query('plugins_classroom::levelSchemas');

// TODO: Check compatibility
module.exports = async function setIsClass(id, isClass, { userSession, transacting } = {}) {
  const permissions = await getSessionPermissions({
    userSession,
    this: this,
    permissions: {
      update: leemons.plugin.config.constants.permissions.bundles.tree.update,
    },
  });
  // TODO: Add better error message
  if (!permissions.update) {
    throw new Error('Permissions not satisfied');
  }
  // ---------------------------------------------------------------------------
  // validate data types
  const schema = {
    type: 'object',
    properties: {
      isClass: {
        type: 'boolean',
      },
      id: {
        type: 'string',
        format: 'uuid',
      },
    },
  };
  const validator = new global.utils.LeemonsValidator(schema);

  if (validator.validate({ id, isClass })) {
    let levelSchema = await levelSchemas.findOne({ id }, { transacting });
    if (!levelSchema) {
      throw new Error("The given id can't be found");
    }

    if (Boolean(levelSchema.isClass) === isClass) {
      return levelSchema;
    }

    const hasChildren = await levelSchemas.count({ parent: id }, { transacting });
    if (hasChildren) {
      throw new Error("Can't make it a class as it has children");
    }

    try {
      levelSchema = await levelSchemas.set({ id }, { isClass }, { transacting });
    } catch (e) {
      throw new Error("Can't update isClass property");
    }

    return levelSchema;
  }
  throw validator.error;
};
