async function add({ class: _class, substage, ctx }) {
  return ctx.tx.db.ClassSubstage.create({ class: _class, substage });
}

module.exports = { add };
