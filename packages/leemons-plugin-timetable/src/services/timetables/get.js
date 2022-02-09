const timeFiltersQuery = require('../../helpers/timetable/timeFiltersQuery');
const { table } = require('../tables');

module.exports = async function get(
  classId,
  { start, startBetween, end, endBetween, transacting } = {}
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

  const timetables = await table.timetable.find(
    {
      ...query,
      ...startQuery,
      ...endQuery,
    },
    { transacting }
  );

  return timetables;
};
