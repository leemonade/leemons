const getSessionPermissions = require('../permissions/getSessionPermissions');
const getEntity = require('./private/getEntity');
const updateEntity = require('./private/updateEntity');
const getLevelSchema = require('../levelSchemas/private/getEntity');

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
    let level = await getEntity(id, { transacting });
    if (!level) {
      throw new Error("The given id can't be found");
    }

    // If the parent did not change, do not alter the database
    if (level.parent === parent) {
      return level;
    }

    // Get corresponding schema
    const levelSchema = await getLevelSchema(level.schema, { transacting });
    if (!levelSchema) {
      throw new Error('The referenced schema does not exists');
    }

    // Check if the parent exists and is compatible with the given LevelSchema
    const validSchemaAndParent = await leemons.plugin.services.levels.hasValidSchemaAndParent(
      levelSchema,
      parent,
      {
        transacting,
      }
    );

    if (!validSchemaAndParent.ok) {
      throw new Error(validSchemaAndParent.message);
    }

    // Update the parent
    try {
      level = await updateEntity({ id }, { parent }, { transacting });
    } catch (e) {
      if (e.code.includes('ER_NO_REFERENCED_ROW')) {
        throw new Error("The given parent can't be found");
      }
      throw new Error("The new parent can't be saved");
    }

    return level;
  }
  throw validator.error;
};
