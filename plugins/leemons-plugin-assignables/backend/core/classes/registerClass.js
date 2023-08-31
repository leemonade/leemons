const { LeemonsError } = require('leemons-error');

async function registerClass({ id, instance, assignable, ctx }) {
  const ids = Array.isArray(id) ? id : [id].filter(Boolean);

  if (!ids.length || !instance || !assignable) {
    throw new LeemonsError(ctx, {
      message: 'id, instance and assignable are required',
      httpStatusCode: 400,
    });
  }
  const classesToSave = ids.map((classId) => ({
    assignableInstance: instance,
    assignable,
    class: classId,
  }));

  await ctx.tx.db.Classes.insertMany(classesToSave);

  return {
    instance,
    assignable,
    classes: ids,
  };
}

module.exports = { registerClass };
