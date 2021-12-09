const { table } = require('../tables');

async function existKnowledgeInProgram(id, program, { transacting } = {}) {
  const count = await table.knowledges.count({ id, program }, { transacting });
  return count > 0;
}

module.exports = { existKnowledgeInProgram };
