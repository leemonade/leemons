const { LeemonsError } = require('@leemons/error');
const _ = require('lodash');

const { SOCKET_EVENTS } = require('../../config/constants');
const { validateAddClassStudents } = require('../../validations/forms');

const {
  addComunicaRoomsBetweenStudentsAndTeachers,
} = require('./addComunicaRoomsBetweenStudentsAndTeachers');
const { classByIds } = require('./classByIds');
const { add: addStudent } = require('./student/add');
const { emitUpdateClassEvent } = require('./updateClass');

function emitUpdateEnrollmentEvent({
  class: classData,
  ctx,
  message,
  status = 'updating',
  error = null,
}) {
  emitUpdateClassEvent({
    class: classData,
    eventName: SOCKET_EVENTS.ENROLLMENT_UPDATE,
    message,
    status,
    error,
    ctx,
  });
}

async function getClass({ classId, ctx }) {
  const classes = await classByIds({ ids: classId, ctx });
  return classes?.[0];
}

function getClassSeats(classroom) {
  if (classroom.parentClass) {
    return getClassSeats(classroom.parentClass);
  }

  return classroom.seats;
}

async function addClassStudents({ data, ctx }) {
  validateAddClassStudents(data);

  const classId = data.class;
  const classData = await getClass({ classId, ctx });
  const seats = getClassSeats(classData);

  // Check if there are seats left in the class
  if (_.isNil(seats)) {
    const errorMessage = 'There are no seats available in the class';

    emitUpdateEnrollmentEvent({
      class: classData,
      ctx,
      message: 'ENROLLMENT_UPDATE_ERROR',
      status: 'error',
      error: errorMessage,
    });

    throw new LeemonsError(ctx, {
      message: errorMessage,
      httpStatusCode: 400,
      customCode: 5001,
    });
  }

  const studentsToAdd = data.students;
  const totalStudentsToAdd = studentsToAdd.length;
  const totalStudentsInClass = classData.students.length + classData.parentStudents.length;

  // Check if there are seats left in the class
  if (seats <= totalStudentsInClass + totalStudentsToAdd) {
    const errorMessage = 'There are not seats available to enrol everyone.';

    emitUpdateEnrollmentEvent({
      class: classData,
      ctx,
      message: 'ENROLLMENT_UPDATE_ERROR',
      status: 'error',
      error: errorMessage,
    });

    throw new LeemonsError(ctx, {
      message: errorMessage,
      httpStatusCode: 400,
      customCode: 5002,
    });
  }

  emitUpdateEnrollmentEvent({ class: classData, ctx, message: 'ENROLLMENT_UPDATE_STUDENTS' });

  const promises = [];
  const allStudents = [...classData.students, ...classData.parentStudents];

  _.forEach(data.students, (student) => {
    // If the student is already enrolled, we don't add them
    const isNotEnrolled = allStudents.indexOf(student) < 0;

    if (isNotEnrolled) {
      promises.push(addStudent({ class: classId, student, ctx }));
    }
  });

  await Promise.all(promises);

  emitUpdateEnrollmentEvent({ class: classData, ctx, message: 'ENROLLMENT_UPDATE_COMMUNICA' });

  const classe = await getClass({ classId, ctx });
  await addComunicaRoomsBetweenStudentsAndTeachers({ classe, ctx });

  emitUpdateEnrollmentEvent({
    class: classe,
    ctx,
    message: 'ENROLLMENT_UPDATE_SUCCESS',
    status: 'completed',
  });

  return getClass({ classId, ctx });
}

module.exports = { addClassStudents, emitUpdateEnrollmentEvent };
