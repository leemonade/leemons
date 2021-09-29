const getSessionPermissions = require('../permissions/getSessionPermissions');
const findEntity = require('./private/findEntity');
const getEntity = require('./private/getEntity');
const updateEntity = require('./private/updateEntity');

const levelSchemas = leemons.query('plugins_subjects::levelSchemas');

// TODO: Check that the parent is compatible
module.exports = async function setParent(id, parent, { userSession, transacting } = {}) {
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
      parent: {
        type: ['string', 'null'],
        format: 'uuid',
      },
      id: {
        type: 'string',
        format: 'uuid',
      },
    },
  };
  const validator = new global.utils.LeemonsValidator(schema);

  if (validator.validate({ id, parent })) {
    // Check the specified parent is not itself
    if (parent === id) {
      throw new Error("The parent can't be itself");
    }

    // Check if the entity exists
    let levelSchema = await getEntity(id, { transacting });
    if (!levelSchema) {
      throw new Error("The given id can't be found");
    }

    // If the parent did not change, do not alter the database
    if (levelSchema.parent === parent) {
      return levelSchema;
    }

    // Check if the parent is a subject
    if (await findEntity({ id: parent, isSubject: true }, { count: true, transacting })) {
      throw new Error("The parent can't be of type subject");
    }

    // Update the parent
    try {
      levelSchema = await updateEntity({ id }, { parent }, { transacting });
    } catch (e) {
      if (e.code.includes('ER_NO_REFERENCED_ROW')) {
        throw new Error("The given parent can't be found");
      }
      throw new Error("the new parent can't be saved");
    }

    return levelSchema;
  }
  throw validator.error;
};
