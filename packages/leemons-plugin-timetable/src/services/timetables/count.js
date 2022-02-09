const timeFiltersQuery = require('../../helpers/timetable/timeFiltersQuery');
const { table } = require('../tables');

module.exports = async function count(
  classId,
  { start, startBetween, end, endBetween, days, transacting } = {}
) {
  const query = {
    class: classId,
  };

  const { start: startQuery, end: endQuery } = timeFiltersQuery({
    start,
    startBetween,
    end,
    endBetween,
  });

  if (days) {
    query.day_$in = days;
  }

  const hasTimetables = await table.timetable.count(
    {
      ...query,
      ...startQuery,
      ...endQuery,
    },
    { transacting }
  );

  return hasTimetables;
};
