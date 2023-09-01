const timeFiltersQuery = require('../helpers/timetable/timeFiltersQuery');

module.exports = async function get({ classId, start, startBetween, end, endBetween, ctx }) {
  const query = {
    class: classId,
  };

  const { start: startQuery, end: endQuery } = timeFiltersQuery({
    start,
    startBetween,
    end,
    endBetween,
  });

  return ctx.tx.db.Timetable.find({
    ...query,
    ...startQuery,
    ...endQuery,
  }).lean();
};
