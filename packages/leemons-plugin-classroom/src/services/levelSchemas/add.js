const getSessionPermissions = require('../permissions/getSessionPermissions');

const tables = {
  levelSchemas: leemons.query('plugins_classroom::levelSchemas'),
  assignableProfiles: leemons.query('plugins_classroom::levelSchemas_profiles'),
};

const multilanguage = leemons.getPlugin('multilanguage')?.services.contents.getProvider();

async function add(
  { names = null, parent = null, isClass = false, assignableProfiles = [], properties = {} } = {},
  { userSession, transacting } = {}
) {
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

  const levelSchema = { name: names, parent, isClass, assignableProfiles, properties };

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
      isClass: {
        type: 'boolean',
      },
      assignableProfiles: {
        type: 'array',
        items: {
          type: 'string',
          format: 'uuid',
        },
      },
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
        let savedLevelSchema;
        let savedAssignableProfiles;
        let savedNames;
        let missingLocales;

        // -----------------------------------------------------------------------
        // Save level schema
        try {
          savedLevelSchema = await tables.levelSchemas.create(levelSchema, { transacting: t });
        } catch (e) {
          if (e.code.includes('ER_NO_REFERENCED_ROW')) {
            throw new Error("LevelSchema's parent was not found");
          }
          throw new Error("LevelSchema can't be created");
        }

        // TODO: Add datasets
        // -----------------------------------------------------------------------
        // Create dataset location
        // const datasetLocation = await addDatasetLocation(names.en, savedLevelSchema.id);

        // -----------------------------------------------------------------------
        // Save assignable profiles
        try {
          savedAssignableProfiles = await tables.assignableProfiles.createMany(
            assignableProfiles.map((profile) => ({
              levelSchemas_id: savedLevelSchema.id,
              profiles_id: profile,
            })),
            { transacting: t }
          );
        } catch (e) {
          if (e.code.includes('ER_NO_REFERENCED_ROW')) {
            throw new Error(`One of the assignable profiles can't be found`);
          }
          throw new Error("The assignable profiles can't be saved");
        }

        // -----------------------------------------------------------------------
        // Save translated names
        try {
          const { items, warnings } = await multilanguage.addManyByKey(
            leemons.plugin.prefixPN(`levelSchemas.${savedLevelSchema.id}.name`),
            names,
            { transacting: t }
          );

          if (warnings?.nonExistingLocales) {
            missingLocales = warnings.nonExistingLocales;
          }

          savedNames = items;
        } catch (e) {
          throw new Error("the translated names can't be saved");
        }

        return {
          ...savedLevelSchema,
          assignableProfiles: savedAssignableProfiles,
          names: savedNames,
          warnings: missingLocales?.length
            ? {
                missingLocales,
              }
            : null,
        };
      },
      tables.levelSchemas,
      transacting
    );
  }
  throw validator.error;
}

module.exports = add;
