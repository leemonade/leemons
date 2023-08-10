const _ = require('lodash');
const { getUserProgramIds } = require('./getUserProgramIds');

async function isUserInsideProgram({
  programId,
  userSession, // es el usuario del que queremos saber si está en el Programa
  ctx,
}) {
  const programIds = await getUserProgramIds({ userSession, ctx });
  return _.includes(programIds, programId);
}

module.exports = { isUserInsideProgram };
