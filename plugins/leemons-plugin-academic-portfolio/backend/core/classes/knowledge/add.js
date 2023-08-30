async function add({ class: _class, knowledge, ctx }) {
  const classKnowledgeDoc = await ctx.tx.db.ClassKnowledges.create({ class: _class, knowledge });
  return classKnowledgeDoc.toObject();
}

module.exports = { add };
