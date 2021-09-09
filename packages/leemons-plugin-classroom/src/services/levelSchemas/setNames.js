const multilanguage = leemons.getPlugin('multilanguage')?.services.contents.getProvider();
const levelSchemas = leemons.query('plugins_classroom::levelSchemas');

module.exports = async function setNames(id, names, { transacting } = {}) {
  // 1st validate data types
  // 2nd validate data integrity
  // 3rd format data
  // 4rd register entries
  // 5th check data registered correctly
  // 6th send success message / send error message

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
    let savedNames;
    let missingLocales;

    const exists = await levelSchemas.count({ id }, { transacting });
    if (!exists) {
      throw new Error("The given id can't be found");
    }

    try {
      const { items, warnings } = await multilanguage.setManyByKey(
        leemons.plugin.prefixPN(`levelSchemas.${id}.name`),
        names,
        { transacting }
      );

      if (warnings?.nonExistingLocales) {
        missingLocales = warnings.nonExistingLocales;
      }

      savedNames = items;
    } catch (e) {
      throw new Error("the translated names can't be saved");
    }
    return { names: savedNames, warnings: { missingLocales } };
  }
  throw validator.error;
};
