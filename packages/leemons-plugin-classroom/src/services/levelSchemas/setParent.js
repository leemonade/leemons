const levelSchemas = leemons.query('plugins_classroom::levelSchemas');

// TODO: Check that the parent is compatible
module.exports = async function setParent(id, parent, { transacting } = {}) {
  // ---------------------------------------------------------------------------
  // validate data types
  const schema = {
    type: 'object',
    properties: {
      parent: {
        type: 'string',
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
    if (parent === id) {
      throw new Error("The parent can't be itself");
    }
    const levelSchema = await levelSchemas.findOne({ id }, { transacting });
    if (!levelSchema) {
      throw new Error("The given id can't be found");
    }

    if (levelSchema.parent === parent) {
      return levelSchema;
    }

    try {
      levelSchema = await levelSchemas.update({ id }, { parent }, { transacting });
    } catch (e) {
      if (e.code.includes('ER_NO_REFERENCED_ROW')) {
        throw new Error("The given parent can't be found");
      }
      throw new Error("the new parent can't be saved");
    }
    return levelSchema;
  } else {
    throw validator.error;
  }
};
