const entitiesFormat = require('../../helpers/config/entitiesFormat');
const getBreaks = require('./breakes/get');

const configTable = leemons.query('plugins_timetable::config');

module.exports = async function get(entitesObj, { transacting } = {}) {
  const { entities, entityTypes } = entitiesFormat(entitesObj);
  // Get the entity's config
  const config = await configTable.findOne({ entities, entityTypes }, { transacting });
  if (config) {
    // Get the entity's breaks
    const breaks = await getBreaks(config.id, { transacting });
    config.days = config.days.split(',');
    return { ...config, breaks };
  }
  return null;
};
