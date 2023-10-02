const dayjs = require('dayjs');

const { hasGrades } = require('./hasGrades');

function getStatus(studentData, instanceData) {
  const startDate = dayjs(studentData?.timestamps?.start || null);
  const endDate = dayjs(studentData?.timestamps?.end || null);
  const instanceStartDate = dayjs(instanceData?.dates?.start || null);
  const deadline = dayjs(instanceData.dates?.deadline || null);
  const closeDate = dayjs(instanceData.dates?.closed || null);

  const endDateIsLate =
    endDate.isValid() && (endDate.isAfter(deadline) || endDate.isAfter(closeDate));
  const started =
    instanceData.alwaysAvailable ||
    (instanceStartDate.isValid() && !instanceStartDate.isAfter(dayjs()));
  const finished = deadline.isValid() && (!deadline.isAfter(dayjs()) || closeDate.isValid());

  if (finished || endDate.isValid()) {
    if (hasGrades(studentData)) {
      return 'evaluated';
    }

    if (endDateIsLate) {
      return 'late';
    }

    if (endDate.isValid()) {
      return 'submitted';
    }

    return 'closed';
  }

  if (started) {
    if (startDate.isValid()) {
      return 'started';
    }

    return 'opened';
  }

  return 'assigned';
}

module.exports = { getStatus };
