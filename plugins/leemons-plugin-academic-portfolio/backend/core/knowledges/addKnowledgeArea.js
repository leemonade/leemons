const { map } = require('lodash');
const { validateAddKnowledgeArea } = require('../../validations/forms');
const { updateClassMany } = require('../classes/updateClassMany');
const { saveManagers } = require('../managers/saveManagers');

async function addKnowledgeArea({ data: _data, ctx }) {
  await validateAddKnowledgeArea({ data: _data, ctx });
  const { subjects, managers, ...data } = _data;
  const knowledgeAreaDoc = await ctx.tx.db.KnowledgeAreas.create(data);
  const knowledgeArea = knowledgeAreaDoc.toObject();
  await saveManagers({
    userAgents: managers,
    type: 'knowledge',
    relationship: knowledgeArea.id,
    ctx,
  });
  if (subjects && subjects.length) {
    const classes = await ctx.tx.db.Class.find({
      subject: subjects,
      program: data.program,
    }).lean();
    await updateClassMany({
      data: {
        ids: map(classes, 'id'),
        knowledge: knowledgeArea.id,
      },
      ctx,
    });
  }
  return knowledgeArea;
}

module.exports = { addKnowledgeArea };
