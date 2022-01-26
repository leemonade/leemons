const breaksTable = leemons.query('plugins_timetable::breaks');

module.exports = async function get(configId, { transacting } = {}) {
  return breaksTable.find(
    { timetable: configId },
    { columns: ['start', 'end', 'name'], transacting }
  );
};
