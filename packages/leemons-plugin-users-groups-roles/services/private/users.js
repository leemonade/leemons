const _ = require('lodash');
const moment = require('moment');
const constants = require('../../config/constants');
// const bcrypt = require('bcrypt');

const table = {
  users: leemons.query('plugins_users-groups-roles::users'),
  userRecoverPassword: leemons.query('plugins_users-groups-roles::user-recover-password'),
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
    // const salt = await bcrypt.genSalt(10);
    // return bcrypt.hash(password, salt);
    return password;
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
    // return bcrypt.compare(password, hashPassword);
    return password === hashPassword;
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
        delete user.password;
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
    const user = await table.users.findOne({ email }, { columns: ['password'] });
    if (!user) throw new Error('Credentials do not match');
    const areEquals = await this.comparePassword(password, user.password);
    if (!areEquals) throw new Error('Credentials do not match');
    return table.users.findOne({ email });
  }

  /**
   * If there is a user with that email we check if there is already a recovery in progress, if
   * there is we resend the email with the previously generated code, if there is no recovery in
   * progress we update an existing expired one or create a new one.
   * @public
   * @static
   * @param {string} email - User email
   * @return {Promise<undefined>} Created / Updated role
   * */
  static async recover(email) {
    const user = await table.users.findOne({ email }, { columns: ['id'] });
    if (!user) throw new Error('Email not found');
    let recovery = await table.userRecoverPassword.findOne({ user: user.id });
    if (recovery) {
      const now = moment(_.now());
      const updatedAt = moment(recovery.updated_at);
      if (now.diff(updatedAt, 'minutes') >= constants.timeForRecoverPassword) {
        recovery = await table.userRecoverPassword.update(
          { id: recovery.id },
          { code: _.random(100000, 999999).toString() }
        );
      }
    } else {
      recovery = await table.userRecoverPassword.create({
        user: user.id,
        code: _.random(100000, 999999).toString(),
      });
    }
    // TODO Mandamos email de recuperacion
    return undefined;
  }
}

module.exports = Users;
