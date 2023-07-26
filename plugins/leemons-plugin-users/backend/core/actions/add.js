const { LeemonsError } = require('leemons-error');

/**
 * Create the action only if the actionName does not already exist, if it does, the existing one is returned.
 * @public
 * @static
 * @param {Object} params
 * @param {MoleculerContext} params.ctx Moleculer context
 * @param {ActionAdd} params.data - Action to add
 * @return {Promise<Action>} Created action
 * */
async function add({ ctx, ...data }) {
  const action = await ctx.tx.db.Actions.countDocuments({ actionName: data.actionName });
  if (action)
    throw new LeemonsError(ctx, { message: `Action '${data.actionName}' already exists` });
  const values = await Promise.all(
    ctx.tx.db.Actions.create({
      actionName: data.actionName,
      order: data.order,
    }),
    ctx.tx.call('multilanguage.common.addManyByKey', {
      key: `users.${data.actionName}.name`,
      data: data.localizationName,
    })
  );
  return values[0];
}

module.exports = { add };
