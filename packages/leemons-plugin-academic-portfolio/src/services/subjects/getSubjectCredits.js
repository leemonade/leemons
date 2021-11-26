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

module.exports = { getSubjectCredits };
