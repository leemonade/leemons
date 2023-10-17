module.exports = function timeFiltersQuery({ end, start, endBetween, startBetween } = {}) {
  let startQuery = {};

  // Start time query
  if (startBetween) {
    const [startStart, startEnd] = startBetween;
    startQuery.start = { $gte: startStart };
    startQuery.start = { $lte: startEnd };
  }
  if (start) {
    // If start between is set, find timetables starting after start or in startBetween
    if (startBetween) {
      startQuery = {
        $or: [
          startQuery,
          {
            start,
          },
        ],
      };
    } else {
      startQuery.start = start;
    }
  }

  // End time query
  let endQuery = {};
  if (endBetween) {
    const [endStart, endEnd] = endBetween;
    endQuery.end = { $gte: endStart };
    endQuery.end = { $lte: endEnd };
  }

  if (end) {
    // If end between is set, find timetables ending before end or in endBetween
    if (endBetween) {
      endQuery = {
        $or: [
          endQuery,
          {
            end,
          },
        ],
      };
    } else {
      endQuery.end = end;
    }
  }

  return {
    start: startQuery,
    end: endQuery,
  };
};
