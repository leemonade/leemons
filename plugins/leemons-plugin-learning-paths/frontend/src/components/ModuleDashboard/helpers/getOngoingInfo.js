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
const getOngoingState = ({ students }) => {
  let someDeliveredButNotAll = false;
  let openedButNotStarted = true;
  let allEvaluated = true;

  students.forEach((student) => {
    switch (student.status) {
      case -1:
      case 2:
        someDeliveredButNotAll = true;
        allEvaluated = false;
        break;
      case 0:
        if (!student.grades || student.grades.length === 0) {
          allEvaluated = false;
        }
        openedButNotStarted = false;
        break;
      case 1:
        someDeliveredButNotAll = true;
        openedButNotStarted = false;
        allEvaluated = false;
        break;
      default:
        return null;
    }
  });

  if (allEvaluated) {
    return 'allEvaluated';
  }
  if (openedButNotStarted) {
    return 'openedButNotStarted';
  }
  if (someDeliveredButNotAll) {
    return 'someDeliveredButNotAll';
  }
};

const getOngoingInfo = ({ instance }) => {
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
