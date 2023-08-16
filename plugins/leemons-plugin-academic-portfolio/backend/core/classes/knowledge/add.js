async function add({ class: _class, knowledge, ctx }) {
  return ctx.tx.db.ClassKnowledges.create({ class: _class, knowledge });
}

module.exports = { add };
