const getSessionPermissions = require('../permissions/getSessionPermissions');
const getLevelSchema = require('../levelSchemas/private/getEntity');
const createEntity = require('./private/createEntity');
const saveNames = require('./private/saveNames');
const saveDescriptions = require('./private/saveDescriptions');

const tables = {
  levels: leemons.query('plugins_subjects::levels'),
  levelSchemas: leemons.query('plugins_subjects::levelSchemas'),
};

async function add(
  { names = null, descriptions = null, schema = null, parent = null, properties = {} } = {},
  { userSession, transacting } = {}
) {
  const permissions = await getSessionPermissions({
    userSession,
    this: this,
    permissions: {
      create: leemons.plugin.config.constants.permissions.bundles.knowledge.create,
    },
  });

  // TODO: Add better error message
  if (!permissions.create) {
    throw new Error('Permissions not satisfied');
  }
  const level = { names, descriptions, schema, parent, properties };

  // ---------------------------------------------------------------------------
  // validate data types
  const schemaLevel = {
    type: 'object',
    properties: {
      names: {
        type: 'object',
      },
      descriptions: {
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
      schema: {
        type: 'string',
        format: 'uuid',
      },
      properties: {
        type: 'object',
      },
    },
  };
  const validator = new global.utils.LeemonsValidator(schemaLevel);

  if (validator.validate(level)) {
    level.properties = JSON.stringify(level.properties);
    // -------------------------------------------------------------------------
    // Register Level inside a transaction
    return global.utils.withTransaction(
      async (t) => {
        // -------------------------------------------------------------------------
        // Get the corresponding LevelSchema
        let levelSchema = null;
        try {
          levelSchema = await getLevelSchema(schema, { transacting });
        } catch (e) {
          throw new Error("The referenced schema can't be fetched");
        }
        if (!levelSchema) {
          throw new Error('The referenced schema does not exists');
        }

        // -------------------------------------------------------------------------
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

        // -----------------------------------------------------------------------
        // Save level schema
        const savedLevel = await createEntity(level, { transacting: t });

        // -----------------------------------------------------------------------
        // Save translated names
        const savedNames = await saveNames(savedLevel.id, names, { transacting: t });

        // -----------------------------------------------------------------------
        // Save translated descriptions
        const savedDescriptions = await saveDescriptions(savedLevel.id, names, { transacting: t });

        // TODO: Optimize
        const missingLocales = [
          ...new Set([
            ...(savedNames.warnings?.missingLocales || []),
            ...(savedDescriptions.warnings?.missingLocales || []),
          ]),
        ];

        return {
          ...savedLevel,
          ...savedNames,
          ...savedDescriptions,
          warnings: missingLocales?.length
            ? {
                missingLocales,
              }
            : null,
        };
      },
      tables.levels,
      transacting
    );
  }
  throw validator.error;
}

module.exports = add;
