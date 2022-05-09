const { table } = require('../tables');
const { getUserProgramIds } = require('./getUserProgramIds');

async function getUserPrograms(userSession, { transacting } = {}) {
  const programIds = await getUserProgramIds(userSession, { transacting });
  return table.programs.find({ id_$in: programIds }, { transacting });
}

module.exports = { getUserPrograms };
