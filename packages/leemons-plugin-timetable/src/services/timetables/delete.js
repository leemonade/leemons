const timetableTable = leemons.query('plugins_timetable::timetable');

module.exports = async function deleteTimetable(timetableId, { transacting } = {}) {
  const { count } = await timetableTable.deleteMany({ id: timetableId }, { transacting });

  return count > 0;
};
