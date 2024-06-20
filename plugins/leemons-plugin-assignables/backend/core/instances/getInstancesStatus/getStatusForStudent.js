const dayjs = require('dayjs');

const { hasGrades } = require('./hasGrades');

/**
 * Determines the status of a student based on their data and the instance data.
 *
 * @param {object} studentData - The student's data.
 *   - The studentData object should have the following properties:
 *     - timestamps: an object with start and end properties representing the start and end dates of the student's activity.
 *     - grades: an array of grades associated with the student.
 * @param {object} instanceData - The instance data.
 *   - The instanceData object should have the following properties:
 *     - dates: an object with start, deadline, and closed properties representing the important dates of the instance.
 *     - alwaysAvailable: a boolean indicating whether the instance is always available.
 * @return {'evaluated'|'late'|'submitted'|'closed'|'started'|'opened'|'assigned'} The status of the student.
 */
function getStatusForStudent(studentData, instanceData) {
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

module.exports = { getStatusForStudent };
