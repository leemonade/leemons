const { grades } = require('../tables');

module.exports = async function getGrade({ assignation, subject, type }, { transacting } = {}) {
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

  return grades.find(query, { transacting });
};
