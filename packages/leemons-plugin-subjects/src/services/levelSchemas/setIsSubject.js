const getSessionPermissions = require('../permissions/getSessionPermissions');

const findEntity = require('./private/findEntity');
const getEntity = require('./private/getEntity');
const updateEntity = require('./private/updateEntity');

// TODO: Check compatibility
module.exports = async function setIsSubject(id, isSubject, { userSession, transacting } = {}) {
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
      isSubject: {
        type: 'boolean',
      },
      id: {
        type: 'string',
        format: 'uuid',
      },
    },
  };
  const validator = new global.utils.LeemonsValidator(schema);

  if (validator.validate({ id, isSubject })) {
    let levelSchema = await getEntity(id, { columns: ['id', 'isSubject'], transacting });
    if (!levelSchema) {
      throw new Error("The given id can't be found");
    }

    // If not modified, do not alter database
    if (Boolean(levelSchema.isSubject) === isSubject) {
      return levelSchema;
    }

    // Check if has children
    if (await findEntity({ parent: id }, { count: true, transacting })) {
      throw new Error("Can't make it a subject as it has children");
    }

    // Set property
    try {
      levelSchema = await updateEntity({ id }, { isSubject }, { transacting });
    } catch (e) {
      throw new Error("Can't update isSubject property");
    }

    return levelSchema;
  }
  throw validator.error;
};
