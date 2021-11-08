const configTable = leemons.query('plugins_timetable::config');

module.exports = function has(entity, entityType, { transacting } = {}) {
  return configTable.count({ entity, entityType }, { transacting }).then((count) => count > 0);
};
