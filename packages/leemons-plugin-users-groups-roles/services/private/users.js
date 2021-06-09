const _ = require('lodash');
const moment = require('moment');
const constants = require('../../config/constants');

const table = {
  users: leemons.query('plugins_users-groups-roles::users'),
  userRecoverPassword: leemons.query('plugins_users-groups-roles::user-recover-password'),
  superAdminUsers: leemons.query('plugins_users-groups-roles::super-admin-users'),
  config: leemons.query('plugins_users-groups-roles::config'),
  userPermission: leemons.query('plugins_users-groups-roles::user-permission'),
  userRole: leemons.query('plugins_users-groups-roles::user-role'),
  groupUser: leemons.query('plugins_users-groups-roles::group-user'),
  groupRole: leemons.query('plugins_users-groups-roles::group-role'),
  rolePermission: leemons.query('plugins_users-groups-roles::role-permission'),
};

let jwtPrivateKey = null;

class Users {
  static async init() {
    await Users.generateJWTPrivateKey();
  }

  /**
   * Check if user exists
   * @public
   * @static
   * @param {any} query
   * @param {boolean} throwErrorIfNotExists
   * @return {Promise<boolean>}
   * */
  static async checkIfExist(query, throwErrorIfNotExists) {
    const count = await table.users.count(query);
    if (throwErrorIfNotExists && !count) throw new Error('User not found');
    return true;
  }

  static async getJWTPrivateKey() {
    if (!jwtPrivateKey) jwtPrivateKey = await table.config.findOne({ key: 'jwt-private-key' });
    return jwtPrivateKey.value;
  }

  static async generateJWTPrivateKey() {
    const config = await table.config.findOne({ key: 'jwt-private-key' });
    if (!config)
      return table.config.create({
        key: 'jwt-private-key',
        value: Users.randomString(),
      });
    return config;
    /*
    if (config) return table.config.update({ id: config.id }, { value: Users.randomString() });
    return table.config.create({ key: 'jwt-private-key', value: Users.randomString() });
     */
  }

  /**
   * Generate long random string
   * @public
   * @static
   * @return {string}
   * */
  static randomString() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  /**
   * Generate the jwt token of passed data
   * @public
   * @static
   * @param {object} payload
   * @return {string} JWT Token
   * */
  static async generateJWTToken(payload) {
    return global.utils.jwt.sign(payload, await Users.getJWTPrivateKey(), {
      expiresIn: 60 * 60 * 24,
    }); // 1 day
  }

  /**
   * Decrypts the jwt token and return his data
   * @public
   * @static
   * @param {string} token
   * @return {any} Payload
   * */
  static async verifyJWTToken(token) {
    return global.utils.jwt.verify(token, await Users.getJWTPrivateKey());
  }

  /**
   * Encrypts the passed password by generating a hash.
   * @private
   * @static
   * @param {string} password
   * @return {Promise<string>} Generated hash password
   * */
  static async encryptPassword(password) {
    const salt = await global.utils.bcrypt.genSalt(10);
    return global.utils.bcrypt.hash(password, salt);
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
    return global.utils.bcrypt.compare(password, hashPassword);
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
            password: await Users.encryptPassword(password),
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
    const userP = await table.users.findOne({ email }, { columns: ['id', 'password'] });
    if (!userP) throw new global.utils.HttpError(401, 'Credentials do not match');
    const areEquals = await Users.comparePassword(password, userP.password);
    if (!areEquals) throw new global.utils.HttpError(401, 'Credentials do not match');
    const [user, token] = await Promise.all([
      table.users.findOne({ email }),
      Users.generateJWTToken({ id: userP.id }),
    ]);
    return { user, token };
  }

  /**
   * If there is a user with that email we check if there is already a recovery in progress, if
   * there is we resend the email with the previously generated code, if there is no recovery in
   * progress we update an existing expired one or create a new one.
   * @public
   * @static
   * @param {string} email - User email
   * @return {Promise<undefined>}
   * */
  static async recover(email) {
    const user = await table.users.findOne({ email }, { columns: ['id'] });
    if (!user) throw new global.utils.HttpError(401, 'Email not found');
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

  /**
   * If there is a user with that email we check if there is already a recovery in progress, if
   * there is we resend the email with the previously generated code, if there is no recovery in
   * progress we update an existing expired one or create a new one.
   * @public
   * @static
   * @param {string} email - User email
   * @param {string} code - Recovery code
   * @param {string} password - New user password
   * @return {Promise<undefined>} Updated user
   * */
  static async reset(email, code, password) {
    const user = await table.users.findOne({ email }, { columns: ['id'] });
    if (!user) throw new global.utils.HttpError(401, 'Email not found');

    const recovery = await table.userRecoverPassword.findOne({ user: user.id, code });
    if (!recovery) throw new global.utils.HttpError(401, 'Credentials do not match');

    const now = moment(_.now());
    const updatedAt = moment(recovery.updated_at);
    if (now.diff(updatedAt, 'minutes') > constants.timeForRecoverPassword)
      throw new global.utils.HttpError(401, 'Credentials do not match');

    return table.users.transaction(async (transacting) => {
      const values = await Promise.all([
        table.users.update({ id: user.id }, { password }, { transacting }),
        table.userRecoverPassword.delete({ id: recovery.id }, { transacting }),
      ]);

      return values[0];
    });
  }

  /**
   * Return super admin user ids
   * @public
   * @static
   * @return {Promise<string[]>} Super admin ids
   * */
  static async getSuperAdminUserIds() {
    // Todo cachear ids de super administrador
    const superAdminUsers = await table.superAdminUsers.find();
    return _.map(superAdminUsers, 'user');
  }

  /**
   * Return if user is super admin
   * @public
   * @static
   * @param {string} userId - User id to check
   * @return {Promise<boolean>} If is super admin return true if not false
   * */
  static async userIsSuperAdmin(userId) {
    const superAdminUsersIds = await Users.getSuperAdminUserIds();
    return _.includes(superAdminUsersIds, userId);
  }

  /**
   * Checks if the user has 1 or more of the specified permissions.
   * @public
   * @static
   * @param {User} user - User to check
   * @param {string[]} allowedPermissions - Array of permissions
   * @return {Promise<boolean>} If have permission return true if not false
   * */
  static async havePermission(user, allowedPermissions) {
    if (user.reloadPermissions) await Users.updateUserPermissions(user.id);

    let hasPermission = await table.userPermission.count({
      user: user.id,
      permission_$in: allowedPermissions,
    });
    if (hasPermission) return true;
    hasPermission = await Users.userIsSuperAdmin(user.id);
    if (hasPermission) return true;
    return false;
  }

  /**
   * Updates the permissions of the user if it is marked as reload permissions according to their
   * roles and the roles of the groups to which they belong.
   * @public
   * @static
   * @param {string} userId - User id
   * @return {Promise<any>}
   * */
  static async updateUserPermissions(userId) {
    // First we search for all user roles
    return table.user.transaction(async (transacting) => {
      const [userRoles, groupUsers] = await Promise.all([
        table.userRole.find({ user: userId }, { columns: ['role'], transacting }),
        table.groupUser.find({ user: userId }, { columns: ['group'], transacting }),
        table.userPermission.deleteMany({ user: userId }, { transacting }),
        table.users.update({ id: userId }, { reloadPermissions: false }, { transacting }),
      ]);
      const groupRoles = await table.groupRole.find(
        { group_$in: _.map(groupUsers, 'group') },
        { columns: ['role'], transacting }
      );

      const roleIds = _.uniq(_.map(userRoles, 'role').concat(_.map(groupRoles, 'role')));

      const rolePermissions = await table.rolePermission.find(
        { role_$in: roleIds },
        {
          columns: ['permission'],
          transacting,
        }
      );

      return table.userPermission.createMany(
        _.map(rolePermissions, (rolePermission) => ({
          user: userId,
          permission: rolePermission.permission,
        })),
        { transacting }
      );
    });
  }

  /**
   * Return the user for the id provided
   * @public
   * @static
   * @param {string} userId - User id
   * @return {Promise<User>}
   * */
  static async detail(userId) {
    const user = await table.users.findOne({ id: userId });
    if (!user) throw new Error('No user found for the id provided');
    return user;
  }

  /**
   * Return the user for the id provided
   * We have two detail functions because possibly in the future detail will return a lot of
   * information not necessary for the backend validation logic.
   * @public
   * @static
   * @param {string} jwtToken
   * @return {Promise<User>}
   * */
  static async detailForJWT(jwtToken) {
    const payload = await Users.verifyJWTToken(jwtToken);
    const user = await table.users.findOne({ id: payload.id });
    if (!user) throw new Error('No user found for the id provided');
    return user;
  }
}

module.exports = Users;
