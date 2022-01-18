const levels = leemons.query('plugins_subjects::levels');
// -----------------------------------------------------------------------
// Update level schema
module.exports = async (query, values, { transacting } = {}) =>
  levels.set(query, values, { transacting });
