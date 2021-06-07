const bcrypt = require('bcrypt');

const table = {
  users: leemons.query('plugins_users-groups-roles::users'),
  superAdminUsers: leemons.query('plugins_users-groups-roles::super-admin-users'),
};

class Users {
  /**
   * Encrypts the passed password by generating a hash.
   * @private
   * @static
   * @param {string} password
   * @return {Promise<string>} Generated hash password
   * */
  static async encryptPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compares a password against a password hash to check if they are equal
   * @private
   * @static
   * @param {string} password
   * @param {string} hashPassword
   * @return {Promise<boolean>} If they are equal, returns true
   * */
  static async comparePassword(password, hashPassword) {
    return bcrypt.compare(password, hashPassword);
  }

  /**
   * Create the first super-administrator user only if no user exists in the database.
   * @public
   * @static
   * @param {string} name - User name
   * @param {string} surnames - User surnames
   * @param {string} email - User email
   * @param {string} password - User password in raw
   * @return {Promise<User>} Created / Updated role
   * */
  static async registerFirstSuperAdminUser(name, surnames, email, password) {
    const hasUsers = await table.users.count();
    if (!hasUsers) {
      return table.users.transaction(async (transacting) => {
        const user = await table.users.create(
          {
            name,
            surnames,
            email,
            password: await this.encryptPassword(password),
          },
          { transacting }
        );
        await table.superAdminUsers.create({ user: user.id }, { transacting });
        return user;
      });
    }
    throw new Error(
      'The first super administrator user can only be created if there are no users in the database.'
    );
  }

  /**
   * Returns the user if there is one with that email and the password matched.
   * @public
   * @static
   * @param {string} email - User email
   * @param {string} password - User password in raw
   * @return {Promise<User>} Created / Updated role
   * */
  static async login(email, password) {
    const user = await table.users.findOne({ email });
    if (!user) throw new Error('Credentials do not match');
  }
}

module.exports = Users;
