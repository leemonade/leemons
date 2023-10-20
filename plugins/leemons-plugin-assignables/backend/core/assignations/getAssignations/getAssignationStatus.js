const dayjs = require('dayjs');

function getAssignationStatus({ dates, timestamps }) {
  let finished = false;
  let started = false;

  const today = dayjs();
  const startDate = dayjs(dates.start || null);
  const deadline = dayjs(dates.deadline || null);
  const closeDate = dayjs(dates.close || null);
  const closedDate = dayjs(dates.closed || null);

  if (
    timestamps.end ||
    (deadline.isValid() && !deadline.isAfter(today)) ||
    (closeDate.isValid() && !closeDate.isAfter(today)) ||
    (closedDate.isValid() && !closedDate.isAfter(today))
  ) {
    finished = true;
  } else {
    finished = false;
  }

  if ((startDate.isValid() && !startDate.isAfter(today)) || !startDate.isValid()) {
    started = true;
  } else {
    started = false;
  }

  return {
    finished,
    started,
  };
}

module.exports = { getAssignationStatus };
