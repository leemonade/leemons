const { validateUpdateKnowledgeArea } = require('../../validations/forms');
const { saveManagers } = require('../managers/saveManagers');

async function updateKnowledgeArea({ data, ctx }) {
  await validateUpdateKnowledgeArea({ data, ctx });
  const { id, managers, ..._data } = data;

  const [knowledgeArea] = await Promise.all([
    ctx.tx.db.KnowledgeAreas.findOneAndUpdate({ id }, _data, { new: true, lean: true }),
    saveManagers({ userAgents: managers, type: 'knowledge', relationship: id, ctx }),
  ]);
  return knowledgeArea;
}
module.exports = { updateKnowledgeArea };
