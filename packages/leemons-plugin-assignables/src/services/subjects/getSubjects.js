const _ = require('lodash');
const { subjects } = require('../tables');

module.exports = async function getSubjects(assignable, { ids = false, transacting } = {}) {
  const relatedSubjects = await subjects.find({ assignable }, { transacting });

  return _.sortBy(
    relatedSubjects.map(({ subject, level, curriculum, id, program }) => {
      const obj = {
        program,
        subject,
        level,
        curriculum: JSON.parse(curriculum) || {},
      };

      if (ids) {
        obj.id = id;
      }

      return obj;
    }),
    'subject',
    'level'
  );
};
