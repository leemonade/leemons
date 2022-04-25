const { grades } = require('../tables');

module.exports = async function registerGrade(
  { assignation, subject, type, grade, gradedBy, feedback },
  { transacting } = {}
) {
  return grades.create(
    {
      assignation,
      subject,
      type,
      grade,
      gradedBy,
      feedback,
      date: global.utils.sqlDatetime(new Date()),
    },
    { transacting }
  );
};
