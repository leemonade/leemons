const _ = require('lodash');
const userService = require('./users');

const table = {
  users: leemons.query('plugins_users-groups-roles::users'),
  groups: leemons.query('plugins_users-groups-roles::groups'),
  groupUser: leemons.query('plugins_users-groups-roles::group-user'),
};

class Groups {
  /**
   * Check if group exists
   * @public
   * @static
   * @param {any} query
   * @param {boolean} throwErrorIfNotExists
   * @return {Promise<boolean>}
   * */
  static async checkIfExist(query, throwErrorIfNotExists) {
    const count = await table.groups.count(query);
    if (throwErrorIfNotExists && !count) throw new Error('Group not found');
    return true;
  }

  /**
   * Create new group if name not in use
   * @public
   * @static
   * @param {string} name - Group name
   * @return {Promise<Group>} Created group
   * */
  static async create(name) {
    const group = await table.groups.findOne({ name });
    if (group) throw new Error('There is already a group with this name');
    return table.groups.create({ name });
  }

  /**
   * Remove group
   * @public
   * @static
   * @param {string} groupId - Group id
   * @return {Promise<undefined>}
   * */
  static async remove(groupId) {
    await Groups.checkIfExist({ id: groupId }, true);
    const groupUsers = await table.groupUser.find({ group: groupId }, { columns: ['user'] });
    const userIdsInGroup = _.map(groupUsers, 'user');
    return table.groupUser.transaction(async () => {
      const values = await Promise.all([
        table.group.delete({ id: groupId }),
        table.users.updateMany({ id_$in: userIdsInGroup }, { reloadPermissions: true }),
      ]);
      return values[0];
    });
  }

  /**
   * Add one user to group if not already in group
   * If you are in, continue without errors
   * @public
   * @static
   * @param {string} groupId - Group id
   * @param {string} userId - User id
   * @return {Promise<undefined>}
   * */
  static async addUser(groupId, userId) {
    await Promise.all([
      Groups.checkIfExist({ id: groupId }, true),
      userService.checkIfExist({ id: userId }, true),
    ]);
    const groupUser = await table.groupUser.count({ group: groupId, user: userId });
    if (!groupUser) {
      return table.groupUser.transaction(async () => {
        const values = await Promise.all([
          table.groupUser.create({ group: groupId, user: userId }),
          table.users.update({ id: userId }, { reloadPermissions: true }),
        ]);
        return values[0];
      });
    }
    return groupUser;
  }

  /**
   * Remove one user from group
   * @public
   * @static
   * @param {string} groupId - Group id
   * @param {string} userId - User id
   * @return {Promise<undefined>}
   * */
  static async removeUser(groupId, userId) {
    await Promise.all([
      Groups.checkIfExist({ id: groupId }, true),
      userService.checkIfExist({ id: userId }, true),
    ]);
    const groupUser = await table.groupUser.count({ group: groupId, user: userId });
    if (groupUser) {
      return table.groupUser.transaction(async () => {
        const values = await Promise.all([
          table.groupUser.delete({ group: groupId, user: userId }),
          table.users.update({ id: userId }, { reloadPermissions: true }),
        ]);
        return values[0];
      });
    }
    return undefined;
  }
}

module.exports = Groups;
