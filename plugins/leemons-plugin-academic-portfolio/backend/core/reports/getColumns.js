const COLUMNS = [
  'center',
  'program',
  'course',
  'subject',
  'classroom',
  'teacher',
  'teacherTags',
  'teacherEmail',
  'teacherEnrollmentDate',
  'teacherLastConnection',
  'student',
  'studentTags',
  'studentEmail',
  'studentEnrollmentDate',
  'studentLastConnection',
];

async function getColumns({ ctx }) {
  return COLUMNS;
}

module.exports = { getColumns };
