const dayjs = require('dayjs');

const INSTANCE_STATUS = {
  EVALUATED: 'evaluated',
  LATE: 'late',
  SUBMITTED: 'submitted',
  CLOSED: 'closed',
  STARTED: 'started',
  OPENED: 'opened',
  ASSIGNED: 'assigned',
};

function getDates(instance) {
  const studentData = instance?.assignations?.[0];

  const startDate = dayjs(studentData?.timestamps?.start || null);
  const endDate = dayjs(studentData?.timestamps?.end || null);
  const instanceStartDate = dayjs(instance?.dates?.start || null);
  const deadline = dayjs(instance?.dates?.deadline || null);
  const closeDate = dayjs(instance?.dates?.closed || null);

  return {
    startDate,
    endDate,
    instanceStartDate,
    deadline,
    closeDate,
  };
}

function getStatus({
  finished,
  hasAllGrades,
  requiresScoring,
  endDateIsLate,
  endDate,
  started,
  startDate,
}) {
  if (finished || endDate.isValid()) {
    if (hasAllGrades || !requiresScoring) {
      return INSTANCE_STATUS.EVALUATED;
    }
    if (endDateIsLate) {
      return INSTANCE_STATUS.LATE;
    }
    if (endDate.isValid()) {
      return INSTANCE_STATUS.SUBMITTED;
    }
    return INSTANCE_STATUS.CLOSED;
  }
  if (started) {
    if (startDate.isValid()) {
      return INSTANCE_STATUS.STARTED;
    }
    return INSTANCE_STATUS.OPENED;
  }
  return INSTANCE_STATUS.ASSIGNED;
}

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
function getStatusForStudent(instance, { requiredGradesCount }) {
  const studentData = instance?.assignations?.[0];
  const { startDate, endDate, instanceStartDate, deadline, closeDate } = getDates(instance);
  const { requiresScoring } = instance;

  const endDateIsLate =
    endDate.isValid() && (endDate.isAfter(deadline) || endDate.isAfter(closeDate));
  const started =
    instance.alwaysAvailable ||
    (instanceStartDate.isValid() && !instanceStartDate.isAfter(dayjs()));
  const finished = deadline.isValid() && (!deadline.isAfter(dayjs()) || closeDate.isValid());
  const hasAllGrades = studentData?.grades?.length >= requiredGradesCount;

  return getStatus({
    finished,
    hasAllGrades,
    requiresScoring,
    endDateIsLate,
    endDate,
    started,
    startDate,
  });
}

module.exports = { getStatusForStudent, INSTANCE_STATUS };
