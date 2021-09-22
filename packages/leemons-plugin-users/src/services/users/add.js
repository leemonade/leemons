const _ = require('lodash');
const existManyRoles = require('../roles/existMany');
const { encryptPassword } = require('./encryptPassword');
const { table } = require('../tables');
const { exist } = require('./exist');
const { addCalendarToUserAgentsIfNeedByUser } = require('./addCalendarToUserAgentsIfNeedByUser');

/**
 * Add a user to platform
 * @public
 * @static
 * @param {AddUser} userData - User data
 * @param {string[]} roles - Roles that the new user will have
 * @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>}
 * */
async function add(
  { name, surnames, password, email, locale, active },
  roles,
  { transacting: _transacting } = {}
) {
  // TODO Validar entrada con ajv
  if (await exist({ email })) throw new Error(`"${email}" email already exists`);
  if (!(await existManyRoles(roles, { transacting: _transacting })))
    throw new Error('One of the ids specified as profile does not exist.');

  return global.utils.withTransaction(
    async (transacting) => {
      const user = await table.users.create(
        {
          name,
          surnames,
          email,
          password: password ? await encryptPassword(password) : undefined,
          locale,
          active: active || false,
        },
        { transacting }
      );

      user.userAgents = await table.userAgent.createMany(
        _.map(roles, (role) => ({
          role,
          user: user.id,
          reloadPermissions: true,
        })),
        { transacting }
      );

      if (leemons.getPlugin('calendar')) {
        await addCalendarToUserAgentsIfNeedByUser(user.id, { transacting });
      }
      return user;
    },
    table.users,
    _transacting
  );
}

module.exports = add;
