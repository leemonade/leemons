const { validateUpdateKnowledge } = require('../../validations/forms');
const { saveManagers } = require('../managers/saveManagers');

async function updateKnowledge({ data, ctx }) {
  await validateUpdateKnowledge({ data, ctx });
  const { id, managers, ..._data } = data;

  const [knowledgeArea] = await Promise.all([
    ctx.tx.db.Knowledges.findOneAndUpdate({ id }, _data, { new: true, lean: true }),
    saveManagers({ userAgents: managers, type: 'knowledge', relationship: id, ctx }),
  ]);
  return knowledgeArea;
}
module.exports = { updateKnowledge };
