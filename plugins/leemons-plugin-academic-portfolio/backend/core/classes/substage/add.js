async function add({ class: _class, substage, ctx }) {
  const classSubstageDoc = await ctx.tx.db.ClassSubstage.create({ class: _class, substage });
  return classSubstageDoc.toObject();
}

module.exports = { add };
