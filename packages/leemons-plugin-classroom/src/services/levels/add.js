const getSessionPermissions = require('../permissions/getSessionPermissions');

const tables = {
  levels: leemons.query('plugins_classroom::levels'),
  levelSchemas: leemons.query('plugins_classroom::levelSchemas'),
};

const multilanguage = leemons.getPlugin('multilanguage')?.services.contents.getProvider();

async function add(
  { names = null, descriptions = null, schema = null, parent = null, properties = {} } = {},
  { userSession, transacting } = {}
) {
  const permissions = await getSessionPermissions({
    userSession,
    this: this,
    permissions: {
      create: leemons.plugin.config.constants.permissions.bundles.organization.create,
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
        let savedLevel;
        let savedNames;
        let savedDescriptions;
        let missingLocales;

        let levelSchema;

        // -------------------------------------------------------------------------
        // Get the corresponding LevelSchema
        try {
          levelSchema = await tables.levelSchemas.findOne({ id: schema }, { transacting: t });
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
        try {
          savedLevel = await tables.levels.create(level, { transacting: t });
        } catch (e) {
          if (e.code.includes('ER_NO_REFERENCED_ROW')) {
            if (!parent) {
              throw new Error('The referenced schema does not exists');
            }
            throw new Error('The referenced parent or schema does not exists');
          }
          throw new Error("LevelSchema can't be created");
        }

        // -----------------------------------------------------------------------
        // Save translated names
        try {
          const { items, warnings } = await multilanguage.addManyByKey(
            leemons.plugin.prefixPN(`levels.${savedLevel.id}.name`),
            names,
            { transacting: t }
          );

          if (warnings?.nonExistingLocales) {
            missingLocales = warnings.nonExistingLocales;
          }

          savedNames = items;
        } catch (e) {
          throw new Error("The translated names can't be saved");
        }

        // -----------------------------------------------------------------------
        // Save translated descriptions
        try {
          const { items, warnings } = await multilanguage.addManyByKey(
            leemons.plugin.prefixPN(`levels.${savedLevel.id}.description`),
            descriptions,
            { transacting: t }
          );

          if (warnings?.nonExistingLocales) {
            missingLocales = new Set([...missingLocales, ...warnings.nonExistingLocales]);
          }

          savedDescriptions = items;
        } catch (e) {
          throw new Error("The translated descriptions can't be saved");
        }

        return {
          ...savedLevel,
          names: savedNames,
          descriptions: savedDescriptions,
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
