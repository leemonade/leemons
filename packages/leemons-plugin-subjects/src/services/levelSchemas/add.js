const getSessionPermissions = require('../permissions/getSessionPermissions');
const createEntity = require('./private/createEntity');
const saveNames = require('./private/saveNames');

const tables = {
  levelSchemas: leemons.query('plugins_subjects::levelSchemas'),
};

async function add(
  {
    names = null,
    descriptions = null,
    parent = null,
    isSubject = false,
    // credits = {},
    // visualIdentification = {},
    properties = {},
  } = {},
  { userSession, transacting } = {}
) {
  // Check permissions
  const permissions = await getSessionPermissions({
    userSession,
    this: this,
    permissions: {
      create: leemons.plugin.config.constants.permissions.bundles.tree.create,
    },
  });

  // TODO: Add better error message
  if (!permissions.create) {
    throw new Error('Permissions not satisfied');
  }

  const levelSchema = {
    name: names,
    descriptions,
    parent,
    isSubject,
    // credits,
    // visualIdentification,
    properties,
  };

  // ---------------------------------------------------------------------------
  // validate data types
  const levelSSchema = {
    type: 'object',
    properties: {
      name: {
        type: 'object',
      },
      parent: {
        oneOf: [
          {
            type: 'null',
          },
          {
            type: 'string',
            format: 'uuid',
          },
        ],
      },
      isSubject: {
        type: 'boolean',
      },
      // credits: {
      //   type: 'object',
      //   properties: {
      //     minimum: {
      //       type: 'boolean',
      //     },
      //     recommended: {
      //       type: 'boolean',
      //     },
      //     maximum: {
      //       type: 'boolean',
      //     },
      //   },
      // },
      properties: {
        type: 'object',
      },
    },
  };
  const validator = new global.utils.LeemonsValidator(levelSSchema);

  if (validator.validate(levelSchema)) {
    levelSchema.properties = JSON.stringify(levelSchema.properties);
    // -------------------------------------------------------------------------
    // Register LevelSchema inside a transaction
    return global.utils.withTransaction(
      async (t) => {
        // Create entity
        const savedLevelSchema = await createEntity(levelSchema, { transacting: t });

        // Save names
        const savedNames = await saveNames(savedLevelSchema.id, names, { transacting: t });
        // -----------------------------------------------------------------------

        return {
          ...savedLevelSchema,
          ...savedNames,
        };
      },
      tables.levelSchemas,
      transacting
    );
  }
  throw validator.error;
}

module.exports = add;
