const { table } = require('../tables');

/**
 * Create the action only if the actionName does not already exist, if it does, the existing one is returned.
 * @public
 * @static
 * @param {ActionAdd} data - Action to add
 * @return {Promise<Action>} Created action
 * */
async function add(data) {
  const action = await table.actions.count({ actionName: data.actionName });
  if (action) throw new Error(`Action '${data.actionName}' already exists`);

  leemons.log.info(`Adding action '${data.actionName}'`);
  return table.actions.transaction(async (transacting) => {
    const values = await Promise.all([
      table.actions.create({ actionName: data.actionName, order: data.order }, { transacting }),
      // TODO Añadir que se añadan las traducciones
    ]);

    return values[0];
  });
}

module.exports = { add };
