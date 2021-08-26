const multilanguage = leemons.getPlugin('multilanguage')?.services.contents.getProvider();
const levelSchemas = leemons.query('plugins_classroom::levelSchemas');

// TODO: Check compatibility
module.exports = async function setIsClass(id, isClass, { transacting } = {}) {
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
      isClass: {
        type: 'boolean',
      },
      id: {
        type: 'string',
        format: 'uuid',
      },
    },
  };
  const validator = new global.utils.LeemonsValidator(schema);

  if (validator.validate({ id, isClass })) {
    let levelSchema = await levelSchemas.findOne({ id }, { transacting });
    if (!levelSchema) {
      throw new Error("The given id can't be found");
    }

    if (levelSchema.isClass == isClass) {
      return levelSchema;
    }

    const hasChildren = await levelSchemas.count({ parent: id }, { transacting });
    if (hasChildren) {
      throw new Error("Can't make it a class as it has children");
    }

    try {
      levelSchema = await levelSchemas.set({ id }, { isClass }, { transacting });
    } catch (e) {
      console.log(e);
      throw new Error("Can't update isClass property");
    }

    return levelSchema;
  } else {
    throw validator.error;
  }
};
