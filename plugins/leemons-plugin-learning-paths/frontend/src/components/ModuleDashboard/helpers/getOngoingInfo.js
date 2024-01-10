import dayjs from 'dayjs';

const getOngoingStatusAsNumber = (student) => {
  const finishDate = dayjs(student?.timestamps?.end || null);
  const startDate = dayjs(student?.timestamps?.start || null);
  const openDate = dayjs(student?.timestamps?.open || null);

  /*
  Status:
  - -1: Not started
  - 0: Finished
  - 1: Started
  - 2: Open
  */

  if (finishDate.isValid()) {
    return 0;
  }

  if (startDate.isValid()) {
    return 1;
  }

  if (openDate.isValid()) {
    return 2;
  }

  return -1;
};

const getEvaluatedCounter = (allStatuses) => {
  const totalStudents = allStatuses?.length;
  const totalStudentsFinished = allStatuses.filter((status) => status === 0).length;
  return { totalStudents, totalStudentsFinished };
};
const getOngoingState = ({ students }) => {
  const allStatuses = [];

  students.forEach((student) => {
    allStatuses.push(student.status);
  });

  if (allStatuses.includes(0) && allStatuses.some((status) => status !== 0)) {
    const evaluatedCount = getEvaluatedCounter(allStatuses);
    return { state: 'someDeliveredButNotAll', ...evaluatedCount };
  }
  if (allStatuses.every((status) => status === 0)) {
    return { state: 'allEvaluated' };
  }
  if (!allStatuses.some((status) => status === 0)) {
    return { state: 'openedButNotStarted' };
  }
};

const getOngoingInfo = ({ instance }) => {
  if (!instance.students) {
    return null;
  }
  const students = instance.students.map((student) => ({
    finished: student.finished,
    grades: student.grades,
    id: student.user,
    status: getOngoingStatusAsNumber(student),
  }));

  return getOngoingState({ students });
};

export default getOngoingInfo;
export { getOngoingInfo };
