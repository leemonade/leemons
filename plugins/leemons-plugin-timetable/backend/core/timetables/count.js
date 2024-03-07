const timeFiltersQuery = require('../helpers/timetable/timeFiltersQuery');

module.exports = async function count({
  classId,
  start,
  startBetween,
  end,
  endBetween,
  days,
  ctx,
}) {
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
    query.day = days;
  }

  return ctx.tx.db.Timetable.countDocuments({
    ...query,
    ...startQuery,
    ...endQuery,
  });
};
