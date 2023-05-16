const _ = require('lodash');
const { table } = require('../tables');

async function getSubjectCredits(subject, program, { transacting } = {}) {
  const response = await table.programSubjectsCredits.find(
    {
      subject_$in: _.isArray(subject) ? subject : [subject],
      program_$in: _.isArray(program) ? program : [program],
    },
    { transacting }
  );
  return _.isArray(subject) || _.isArray(program) ? response : response[0];
}

async function getSubjectsCredits(subjects, { transacting } = {}) {
  const query = subjects.map((subject) => _.pick(subject, ['subject', 'program']));

  const response = await table.programSubjectsCredits.find({ $or: query }, { transacting });

  return response;
}

module.exports = { getSubjectCredits, getSubjectsCredits };
