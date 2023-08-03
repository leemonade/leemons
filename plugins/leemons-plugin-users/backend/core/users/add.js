const _ = require('lodash');
const { LeemonsError } = require('leemons-error');

const existManyRoles = require('../roles/existMany');
const { encryptPassword } = require('./bcrypt/encryptPassword');
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
async function add({
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
  roles,
  sendWellcomeEmail,
  ctx,
}) {
  if (await exist({ query: { email }, ctx }))
    throw new LeemonsError(ctx, { message: `"${email}" email already exists` });
  if (!(await existManyRoles({ roles, ctx })))
    throw new LeemonsError(ctx, { message: 'One of the roles specified does not exist.' });

  const user = await ctx.tx.db.Users.create({
    name,
    surnames,
    secondSurname,
    birthdate: birthdate ? global.utils.sqlDatetime(birthdate) : birthdate,
    email,
    gender,
    password: password ? await encryptPassword(password) : undefined,
    locale,
    active: active || false,
  });

  await Promise.all(
    _.map(roles, (role) => checkIfCanCreateNUserAgentsInRoleProfiles({ nUserAgents: 1, role, ctx }))
  );

  user.userAgents = await ctx.tx.db.UserAgent.insertMany(
    _.map(roles, (role) => ({
      role,
      user: user.id,
      reloadPermissions: true,
    }))
  );

  await addCenterProfilePermissionToUserAgents({ userAgentIds: _.map(user.userAgents, 'id'), ctx });

  // --- Asset
  await addUserAvatar({ user, avatar, ctx });

  if (tags && _.isArray(tags) && tags.length) {
    await Promise.all;
    _.map(user.userAgents, (userAgent) => {
      ctx.tx.call('common.tags.setTagsToValues', {
        type: 'users.user-agent',
        tags,
        values: userAgent.id,
      });
    });
  }

  // TODO migration: Ver como preguntar a deploy-manager si "existe" calendar
  if (leemons.getPlugin('calendar')) {
    await addCalendarToUserAgentsIfNeedByUser({ user: user.id, ctx });
  }
  return user;
}

module.exports = { add };
