const { LeemonsError } = require('@leemons/error');
const _ = require('lodash');

const addUserInProvider = require('../providers/users/addUser');
const existManyRoles = require('../roles/existMany');
const {
  addCenterAssetsPermissionToCenterAdminUserAgent,
} = require('../user-agents/addCenterAssetsPermissionToCenterAdminUserAgent');
const {
  addCenterProfilePermissionToUserAgents,
} = require('../user-agents/addCenterProfilePermissionToUserAgents');
const {
  addCalendarToUserAgentsIfNeedByUser,
} = require('../user-agents/calendar/addCalendarToUserAgentsIfNeedByUser');

const { addUserAvatar } = require('./addUserAvatar');
const { encryptPassword } = require('./bcrypt/encryptPassword');
const {
  checkIfCanCreateNUserAgentsInRoleProfiles,
} = require('./checkIfCanCreateNUserAgentsInRoleProfiles');
const { exist } = require('./exist');

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
  ctx,
}) {
  if (await exist({ query: { email }, ctx }))
    throw new LeemonsError(ctx, { message: `"${email}" email already exists` });
  if (!(await existManyRoles({ roles, ctx })))
    throw new LeemonsError(ctx, { message: 'One of the roles specified does not exist.' });

  const userDoc = await ctx.tx.db.Users.create({
    name,
    surnames,
    secondSurname,
    birthdate,
    email,
    gender,
    password: password ? await encryptPassword(password) : undefined,
    locale,
    active: active || false,
  });
  const user = userDoc.toObject();

  await Promise.all(
    _.map(roles, (role) => checkIfCanCreateNUserAgentsInRoleProfiles({ nUserAgents: 1, role, ctx }))
  );

  user.userAgents = (
    await ctx.tx.db.UserAgent.insertMany(
      _.map(roles, (role) => ({
        role,
        user: user.id,
        reloadPermissions: true,
      }))
    )
  ).map((doc) => doc.toObject());

  await addCenterProfilePermissionToUserAgents({ userAgentIds: _.map(user.userAgents, 'id'), ctx });
  await Promise.all(
    _.map(user.userAgents, (userAgent) =>
      addCenterAssetsPermissionToCenterAdminUserAgent({ userAgent, ctx })
    )
  );

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

  await addCalendarToUserAgentsIfNeedByUser({ user: user.id, ctx });

  await addUserInProvider({ user: { id: user.id, email, password }, ctx });

  return user;
}

module.exports = { add };
