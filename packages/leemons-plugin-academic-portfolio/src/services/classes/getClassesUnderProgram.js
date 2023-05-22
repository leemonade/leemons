const _ = require('lodash');
const { table } = require('../tables');

async function getClassesUnderProgram(program, { transacting } = {}) {
  const programs = _.isArray(program) ? program : [program];
  const classes = await table.class.find(
    { program_$in: programs },
    { columns: ['id'], transacting }
  );
  return _.map(classes, 'id');
}

module.exports = { getClassesUnderProgram };
