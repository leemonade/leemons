const levels = leemons.query('plugins_subjects::levels');
// -----------------------------------------------------------------------
// Delete level schema
module.exports = async (level, { transacting } = {}) => {
  try {
    return await levels.delete(level, { transacting });
  } catch (e) {
    throw new Error("Level can't be deleted");
  }
};
