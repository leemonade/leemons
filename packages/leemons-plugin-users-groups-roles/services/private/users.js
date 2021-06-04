class Users {
  /**
   * Create the first admin user only if
   * @private
   * @static
   * @param {string=} id - Role id
   * @param {string=} name - Role name
   * @param {string[]} permissions - Array of permissions
   * @return {Promise<Role>} Crated / Updated role
   * */
  static async registerFirstAdminUser(name, surnames, email, password) {}
}

module.exports = Users;
