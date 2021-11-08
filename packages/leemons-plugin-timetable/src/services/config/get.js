const configTable = leemons.query('plugins_timetable::config');
const breaksTable = leemons.query('plugins_timetable::breaks');

module.exports = async function get(entity, entityType, { transacting } = {}) {
  // Get the entity's config
  const config = await configTable.findOne({ entity, entityType }, { transacting });
  if (config) {
    // Get the entity's breaks
    const breaks = await breaksTable.find({ timetable: config.id }, { transacting });

    return { ...config, breaks };
  }
  return null;
};
