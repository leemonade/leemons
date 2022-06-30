const { grades } = require('../tables');

module.exports = async function registerGrade(
  { assignation, subject, type, grade, gradedBy, feedback, visibleToStudent },
  { transacting } = {}
) {
  return grades.set(
    {
      assignation,
      subject,
      type,
    },
    {
      grade,
      gradedBy,
      feedback,
      date: global.utils.sqlDatetime(new Date()),
      visibleToStudent,
    },
    { transacting }
  );
};
