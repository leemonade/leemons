const { map } = require('lodash');
const { validateAddKnowledge } = require('../../validations/forms');
const { updateClassMany } = require('../classes/updateClassMany');
const { saveManagers } = require('../managers/saveManagers');

async function addKnowledge({ data: _data, ctx }) {
  await validateAddKnowledge({ data: _data, ctx });
  const { subjects, managers, ...data } = _data;
  const knowledge = await ctx.tx.db.Knowledges.create(data);
  await saveManagers({ userAgents: managers, type: 'knowledge', relationship: knowledge.id, ctx });
  if (subjects && subjects.length) {
    const classes = await ctx.tx.db.Class.find({
      subject: subjects,
      program: data.program,
    }).lean();
    await updateClassMany({
      data: {
        ids: map(classes, 'id'),
        knowledge: knowledge.id,
      },
      ctx,
    });
  }
  return knowledge;
}

module.exports = { addKnowledge };
