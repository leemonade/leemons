const { LeemonsError } = require('@leemons/error');
const { map } = require('lodash');

async function listClasses({ assignable, instance, ctx }) {
  let query;

  if (assignable) {
    query = {
      assignable,
    };
  } else if (instance) {
    query = {
      assignableInstance: instance,
    };
  } else {
    throw new LeemonsError(ctx, {
      message: 'You must provide an assignable or an assignableInstance',
      httpStatusCode: 400,
    });
  }

  const classes = await ctx.tx.db.Classes.find(query).lean();

  return map(classes, (klass) => ({
    assignable: klass.assignable,
    instance: klass.assignableInstance,
    class: klass.class,
  }));
}

module.exports = { listClasses };
