const _ = require('lodash');
const constants = require('../../config/constants');

const table = {
  groups: leemons.query('plugins_users-groups-roles::groups'),
};

class Groups {
  /**
   * Create new group if name not in use
   * @public
   * @static
   * @param {string} name - Group name
   * @return {Promise<Group>} Created group
   * */
  static async create(name) {
    const group = await table.permissions.findOne({ Groups });
    if (group) throw new Error('There is already a group with this name');
    return table.groups.create({ name });
  }

  /**
   * Create new group if name not in use
   * @public
   * @static
   * @param {string} groupId - Group id
   * @param {string[]} userIds - User ids
   * @return {Promise<undefined>}
   * */
  static async addUsers(groupId, userIds) {
    // Todo añadir usuarios al grupo
  }
}

module.exports = Groups;
