const COLUMNS = [
  'center',
  'program',
  'course',
  'subject',
  'classroom',
  'teacher',
  'teacherEmail',
  'student',
  'studentEmail',
  'studentEnrollmentDate',
  'teacherEnrollmentDate',
  'teacherLastConnection',
  'studentLastConnection',
];

async function getColumns({ ctx }) {
  return COLUMNS;
}

module.exports = { getColumns };
