const _ = require('lodash');
const constants = require('../../config/constants');

const table = {
  actions: leemons.query('plugins_users::actions'),
};

class Actions {
  /**
   * Creates the default actions that come with the leemons app
   * @public
   * @static
   * */
  static async init() {
    await Actions.addMany(constants.defaultActions);
  }

  /**
   * Create the action only if the actionName does not already exist, if it does, the existing one is returned.
   * @public
   * @static
   * @param {ActionAdd} data - Action to add
   * @return {Promise<Action>} Created action
   * */
  static async add(data) {
    const action = await table.permissions.count({ actionName: data.actionName });
    if (action) throw new Error(`Action '${data.actionName}' already exists`);

    leemons.log.info(`Adding action '${data.actionName}'`);
    return table.actions.transaction(async (transacting) => {
      const values = await Promise.all([
        table.actions.create({ actionName: data.actionName }, { transacting }),
        // TODO Añadir que se añadan las traducciones
      ]);

      return values[0];
    });
  }

  /**
   * Create multiple actions
   * @public
   * @static
   * @param {ActionAdd[]} data - Array of actions to add
   * @return {Promise<ManyResponse>} Created actions
   * */
  static async addMany(data) {
    const response = await Promise.allSettled(_.map(data, (d) => Actions.add(d)));
    return global.utils.settledResponseToManyResponse(response);
  }
}

module.exports = Actions;
