const table = leemons.query('plugins_classroom::levels');

const multilanguage = leemons.getPlugin('multilanguage')?.services.contents.getProvider();

async function add(
  { names = null, descriptions = null, schema = null, parent = null } = {},
  { transacting } = {}
) {
  const level = { names, descriptions, schema, parent };

  // ---------------------------------------------------------------------------
  // validate data types
  const levelSchema = {
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
    },
  };
  const validator = new global.utils.LeemonsValidator(levelSchema);

  if (validator.validate(level)) {
    // -------------------------------------------------------------------------
    // Register LevelSchema inside a transaction
    return global.utils.withTransaction(
      async (t) => {
        let savedLevel;
        let savedNames;
        let savedDescriptions;
        let missingLocales;

        // -----------------------------------------------------------------------
        // Save level schema
        try {
          savedLevel = await table.create(level, { transacting: t });
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
          throw new Error("the translated names can't be saved");
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
          throw new Error("the translated descriptions can't be saved");
        }

        return {
          ...savedLevel,
          names: savedNames,
          descriptions: savedDescriptions,
          warnings: missingLocales.length
            ? {
                missingLocales,
              }
            : null,
        };
      },
      table,
      transacting
    );
  }
  throw validator.error;
}

module.exports = add;
