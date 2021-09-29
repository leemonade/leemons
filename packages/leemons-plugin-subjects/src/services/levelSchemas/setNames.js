const getSessionPermissions = require('../permissions/getSessionPermissions');
const findEntity = require('./private/findEntity');
const saveNames = require('./private/saveNames');

module.exports = async function setNames(id, names, { userSession, transacting } = {}) {
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
      names: {
        type: 'object',
      },
      id: {
        type: 'string',
        format: 'uuid',
      },
    },
  };
  const validator = new global.utils.LeemonsValidator(schema);

  if (validator.validate({ id, names })) {
    // Check if entity exists
    if (!(await findEntity({ id }, { count: true, columns: ['id', 'isSubject'], transacting }))) {
      throw new Error("The given id can't be found");
    }

    // Update names
    return saveNames(id, names, { deleteEmpty: true, transacting });
  }
  throw validator.error;
};
