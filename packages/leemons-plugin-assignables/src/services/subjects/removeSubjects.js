const _ = require('lodash');
const { subjects } = require('../tables');

module.exports = async function removeSubjects(subjectsIds, { transacting } = {}) {
  if (subjectsIds.some((id) => !_.isNumber(id))) {
    throw new Error('Subjects ids must be strings');
  }

  return subjects.deleteMany({ id_$in: subjectsIds }, { transacting });
};
