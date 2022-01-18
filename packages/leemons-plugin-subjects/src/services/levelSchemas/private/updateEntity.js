const levelSchemas = leemons.query('plugins_subjects::levelSchemas');
// -----------------------------------------------------------------------
// Update level schema
module.exports = async (query, values, { transacting } = {}) =>
  levelSchemas.set(query, values, { transacting });
