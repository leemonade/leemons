const { grades } = require('../tables');

module.exports = async function unregisterGrade(
  { assignation, subject, type },
  { transacting } = {}
) {
  // TODO: Check permissions
  const query = {
    assignation,
  };

  if (subject) {
    query.subject = subject;
  }

  if (type) {
    query.type = type;
  }

  return grades.deleteMany(query, { transacting });
};
