const levelSchemas = leemons.query('plugins_subjects::levelSchemas');
// -----------------------------------------------------------------------
// Save level schema
module.exports = async (levelSchema, { transacting } = {}) => {
  try {
    return await levelSchemas.create(levelSchema, { transacting });
  } catch (e) {
    if (e.code.includes('ER_NO_REFERENCED_ROW')) {
      throw new Error("LevelSchema's parent was not found");
    }
    throw new Error("LevelSchema can't be created");
  }
};
