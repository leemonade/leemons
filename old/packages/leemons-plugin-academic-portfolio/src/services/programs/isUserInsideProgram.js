const _ = require('lodash');
const { getUserProgramIds } = require('./getUserProgramIds');

async function isUserInsideProgram(userSession, programId, { transacting } = {}) {
  const programIds = await getUserProgramIds(userSession, { transacting });
  return _.includes(programIds, programId);
}

module.exports = { isUserInsideProgram };
