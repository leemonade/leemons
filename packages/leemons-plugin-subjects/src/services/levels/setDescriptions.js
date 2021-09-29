const getSessionPermissions = require('../permissions/getSessionPermissions');
const findEntity = require('./private/findEntity');
const saveDescriptions = require('./private/saveDescriptions');

module.exports = async function setDescriptions(
  id,
  descriptions,
  { userSession, transacting } = {}
) {
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
      descriptions: {
        type: 'object',
      },
      id: {
        type: 'string',
        format: 'uuid',
      },
    },
  };
  const validator = new global.utils.LeemonsValidator(schema);

  if (validator.validate({ id, descriptions })) {
    // Check if entity exists
    if (!(await findEntity({ id }, { count: true, transacting }))) {
      throw new Error("The given id can't be found");
    }

    // Update names
    return saveDescriptions(id, descriptions, { deleteEmpty: true, transacting });
  }
  throw validator.error;
};
