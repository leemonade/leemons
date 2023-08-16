async function add({ class: _class, group, ctx }) {
  return ctx.tx.db.ClassGroup.create({ class: _class, group });
}

module.exports = { add };
