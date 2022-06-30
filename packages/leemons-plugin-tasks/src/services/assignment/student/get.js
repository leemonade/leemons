const { userInstances } = require('../../table');

const COLUMNS = ['opened', 'start', 'end', 'grade', 'teacherFeedback'];
const DEFAULT_COLUMNS = ['opened', 'start', 'end'];

module.exports = async function getStudentDetails(
  student,
  instance,
  { columns = DEFAULT_COLUMNS, transacting } = {}
) {
  const assignmentColumns = columns.filter((c) => COLUMNS.includes(c));

  const result = await userInstances.find(
    {
      instance,
      user: student,
    },
    { columns: assignmentColumns, transacting }
  );

  return result[0];
};
