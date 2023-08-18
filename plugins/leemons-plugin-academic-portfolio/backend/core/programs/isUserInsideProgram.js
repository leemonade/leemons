const _ = require('lodash');
const { getUserProgramIds } = require('./getUserProgramIds');

async function isUserInsideProgram({ programId, ctx }) {
  const programIds = await getUserProgramIds({ ctx });
  return _.includes(programIds, programId);
}

module.exports = { isUserInsideProgram };
