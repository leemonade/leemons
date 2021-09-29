const levels = leemons.query('plugins_subjects::levels');
// -----------------------------------------------------------------------
// Save level schema
module.exports = async (level, { transacting } = {}) => {
  try {
    return await levels.create(level, { transacting });
  } catch (e) {
    if (e.code.includes('ER_NO_REFERENCED_ROW')) {
      throw new Error("Level's parent was not found");
    }
    throw new Error("Level can't be created");
  }
};
