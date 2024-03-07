async function listAssignableClasses({ id, ctx }) {
  const classes = await ctx.tx.db.Classes.find({ assignable: id }).lean();

  return classes.map((klass) => ({
    instance: klass.assignableInstance,
    assignable: klass.assignable,
    class: klass.class,
  }));
}

module.exports = { listAssignableClasses };
