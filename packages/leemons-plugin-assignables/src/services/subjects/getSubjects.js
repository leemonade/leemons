const { subjects } = require('../tables');

module.exports = async function getSubjects(assignable, { transacting } = {}) {
  const relatedSubjects = await subjects.find({ assignable }, { transacting });

  return relatedSubjects.map(({ subject, level, curriculum }) => ({
    subject,
    level,
    curriculum: JSON.parse(curriculum),
  }));
};
