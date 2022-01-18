const levelSchemas = leemons.query('plugins_subjects::levelSchemas');
// -----------------------------------------------------------------------
// Delete level schema
module.exports = async (levelSchema, { transacting } = {}) => {
  try {
    return await levelSchemas.delete(levelSchema, { transacting });
  } catch (e) {
    throw new Error("LevelSchema can't be deleted");
  }
};
