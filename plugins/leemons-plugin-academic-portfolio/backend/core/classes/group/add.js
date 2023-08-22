async function add({ class: _class, group, ctx }) {
  const classGroupDoc = await ctx.tx.db.ClassGroup.create({ class: _class, group });
  return classGroupDoc.toObject();
}

module.exports = { add };
