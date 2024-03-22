const _ = require('lodash');

async function removeKnowledgeByIds({ ids, soft, ctx }) {
  const knowledges = await ctx.tx.db.KnowledgeAreas.find({
    id: _.isArray(ids) ? ids : [ids],
  }).lean();
  await ctx.tx.emit('before-remove-knowledges', { knowledges, soft });
  await ctx.tx.db.KnowledgeAreas.deleteMany({ id: _.map(knowledges, 'id') }, { soft });
  await ctx.tx.emit('after-remove-knowledges', { knowledges, soft });
  return true;
}

module.exports = { removeKnowledgeByIds };
