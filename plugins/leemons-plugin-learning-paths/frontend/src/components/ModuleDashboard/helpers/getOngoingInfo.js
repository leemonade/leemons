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

const getEvaluatedCounter = ({ students, subjects, allStatuses }) => {
  const totalStudents = students?.length;

  const totalStudentsFinished = allStatuses.filter((status) => status === 0).length;

  const totalStudentsEvaluated = students.filter((student) => {
    const { grades } = student;

    const mainGrades = grades.filter((grade) => grade.type === 'main');
    return mainGrades?.length >= subjects?.length;
  }).length;
  return { totalStudents, totalStudentsEvaluated, totalStudentsFinished };
};

const getOngoingState = ({ students, subjects }) => {
  const allStatuses = [];

  students.forEach((student) => {
    allStatuses.push(student.status);
  });

  const evaluatedCount = getEvaluatedCounter({ students, subjects, allStatuses });

  if (
    evaluatedCount.totalStudentsFinished > 0 &&
    evaluatedCount.totalStudentsFinished < evaluatedCount.totalStudents
  ) {
    return { state: 'someDeliveredButNotAll', ...evaluatedCount };
  }

  if (evaluatedCount.totalStudentsEvaluated >= evaluatedCount.totalStudents) {
    return { state: 'allEvaluated', ...evaluatedCount };
  }

  if (evaluatedCount.totalStudentsEvaluated > 0) {
    return { state: 'someEvaluated', ...evaluatedCount };
  }

  if (allStatuses.some((status) => status === 2)) {
    return { state: 'openedButNotStarted' };
  }

  if (evaluatedCount.totalStudentsFinished === evaluatedCount.totalStudents) {
    return { state: 'allFinished', ...evaluatedCount };
  }

  return null;
};

const getOngoingInfo = ({ instance }) => {
  if (!instance?.students) {
    return null;
  }
  const students = instance.students.map((student) => ({
    student,
    finished: student.finished,
    grades: student.grades,
    id: student.user,
    status: getOngoingStatusAsNumber(student),
  }));

  return getOngoingState({ students, subjects: instance.subjects });
};

export default getOngoingInfo;
export { getOngoingInfo };
