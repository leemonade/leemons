const _ = require('lodash');
const existManyRoles = require('../roles/existMany');
const { encryptPassword } = require('./bcrypt/encryptPassword');
const { table } = require('../tables');
const { exist } = require('./exist');
const {
  addCalendarToUserAgentsIfNeedByUser,
} = require('../user-agents/calendar/addCalendarToUserAgentsIfNeedByUser');
const { addUserAvatar } = require('./addUserAvatar');
const {
  checkIfCanCreateNUserAgentsInRoleProfiles,
} = require('./checkIfCanCreateNUserAgentsInRoleProfiles');
const {
  addCenterProfilePermissionToUserAgents,
} = require('../user-agents/addCenterProfilePermissionToUserAgents');

/**
 * Add a user to platform
 * @public
 * @static
 * @param {AddUser} userData - User data
 * @param {string[]} roles - Roles that the new user will have
 * @param {boolean} sendWellcomeEmail
 * @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>}
 * */
async function add(
  {
    name,
    surnames,
    secondSurname,
    avatar,
    birthdate,
    tags,
    gender,
    email,
    locale,
    password,
    active,
  },
  roles,
  { sendWellcomeEmail, transacting: _transacting } = {}
) {
  if (await exist({ email })) throw new Error(`"${email}" email already exists`);
  if (!(await existManyRoles(roles, { transacting: _transacting })))
    throw new Error('One of the ids specified as profile does not exist.');

  return global.utils.withTransaction(
    async (transacting) => {
      const user = await table.users.create(
        {
          name,
          surnames,
          secondSurname,
          birthdate: birthdate ? global.utils.sqlDatetime(birthdate) : birthdate,
          email,
          gender,
          password: password ? await encryptPassword(password) : undefined,
          locale,
          active: active || false,
        },
        { transacting }
      );

      await Promise.all(
        _.map(roles, (role) => checkIfCanCreateNUserAgentsInRoleProfiles(1, role, { transacting }))
      );

      user.userAgents = await table.userAgent.createMany(
        _.map(roles, (role) => ({
          role,
          user: user.id,
          reloadPermissions: true,
        })),
        { transacting }
      );

      await addCenterProfilePermissionToUserAgents(_.map(user.userAgents, 'id'), { transacting });

      // --- Asset
      await addUserAvatar(user, avatar, { transacting });

      if (tags && _.isArray(tags) && tags.length) {
        const tagsService = leemons.getPlugin('common').services.tags;
        await Promise.all(
          _.map(user.userAgents, (userAgent) =>
            tagsService.setTagsToValues('plugins.users.user-agent', tags, userAgent.id, {
              transacting,
            })
          )
        );
      }

      if (leemons.getPlugin('calendar')) {
        await addCalendarToUserAgentsIfNeedByUser(user.id, { transacting });
      }
      return user;
    },
    table.users,
    _transacting
  );
}

module.exports = { add };
