const getBreaks = require('./breakes/get');

const configTable = leemons.query('plugins_timetable::config');

module.exports = async function get(entity, entityType, { transacting } = {}) {
  // Get the entity's config
  const config = await configTable.findOne({ entity, entityType }, { transacting });
  if (config) {
    // Get the entity's breaks
    const breaks = await getBreaks(config.id, { transacting });
    config.days = config.days.split(',');
    return { ...config, breaks };
  }
  return null;
};
