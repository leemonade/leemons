const { table } = require('../tables');

module.exports = async function deleteTimetable(timetableId, { transacting } = {}) {
  const { count } = await table.timetable.deleteMany({ id: timetableId }, { transacting });

  return count > 0;
};
