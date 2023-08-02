const { table } = require('../tables');

async function getClassProgram(id, { transacting } = {}) {
  const classe = await table.class.findOne({ id }, { transacting });
  return table.programs.findOne({ id_$in: classe.program }, { transacting });
}

module.exports = { getClassProgram };
