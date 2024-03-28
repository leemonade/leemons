const _ = require('lodash');
const {
  getRoleForRelationshipProfileCenter,
} = require('../profiles/getRoleForRelationshipProfileCenter');
const { encryptPassword } = require('./bcrypt/encryptPassword');
const getDefaultLocale = require('../platform/getDefaultLocale');
const {
  addCalendarToUserAgentsIfNeedByUser,
} = require('../user-agents/calendar/addCalendarToUserAgentsIfNeedByUser');
const { validateAddUsersBulkForm } = require('../../validations/forms');
const { sendWelcomeEmailToUser } = require('./sendWelcomeEmailToUser');
const { setUserForRegisterPassword } = require('./setUserForRegisterPassword');
const { sendNewProfileAddedEmailToUser } = require('./sendNewProfileAddedEmailToUser');
const { addUserAvatar } = require('./addUserAvatar');
const { setUserDatasetInfo } = require('../user-agents/setUserDatasetInfo');
const {
  checkIfCanCreateNUserAgentsInRoleProfiles,
} = require('./checkIfCanCreateNUserAgentsInRoleProfiles');
const {
  addCenterProfilePermissionToUserAgents,
} = require('../user-agents/addCenterProfilePermissionToUserAgents');
const { sendActivationEmailsByProfileToUser } = require('./sendActivationEmailsByProfileToUser');

/**
 * Function to handle the creation or update of a user.
 *
 * @param {Object} params The parameters for creating or updating a user.
 * @param {string} [params.id] The ID of the user to update. If not provided, a new user will be created.
 * @param {Object} params.userData The data of the user.
 * @param {Date} params.birthdate The birthdate of the user.
 * @param {string} params.password The password of the user.
 * @param {MoleculerContext} params.ctx The Moleculer's context.
 * @returns {Promise<Object>} An object containing the user and a flag indicating if it's a new user.
 */
async function handleUserCreationOrUpdate({ id, userData, birthdate, password, ctx }) {
  let user = null;
  if (id) {
    user = await ctx.tx.db.Users.findOne({ id }).lean();
  } else {
    user = await ctx.tx.db.Users.findOne({ email: userData.email }).lean();
  }
  let isNewUser = false;

  if (!user) {
    user = await ctx.tx.db.Users.create({
      ...userData,
      birthdate,
      password: password ? await encryptPassword(password) : undefined,
    });
    user = user.toObject();
    isNewUser = true;
  } else if (id) {
    await ctx.tx.db.Users.updateOne(
      { id },
      {
        ...userData,
        birthdate,
      }
    );
  }
  return { user, isNewUser };
}

/**
 * Function to handle the creation or restoration of a user agent.
 *
 * @param {Object} params The parameters for creating or restoring a user agent.
 * @param {Object} params.user The user object.
 * @param {Object} params.role The role object.
 * @param {Object} params.isNewUser The flag to indicate if the user is new.
 * @param {UserProfile} params.profile The profile object.
 * @param {MoleculerContext} params.ctx The Moleculer's context.
 * @returns {Promise<Object>} The created or restored user agent object.
 */
async function handleUserAgent({ user, role, isNewUser, profile, ctx }) {
  let userAgent = await ctx.tx.db.UserAgent.findOne(
    {
      user: user.id,
      role,
    },
    undefined,
    { excludeDeleted: false }
  ).lean();

  if (!userAgent) {
    await checkIfCanCreateNUserAgentsInRoleProfiles({ nUserAgents: 1, role, ctx });
    userAgent = await ctx.tx.db.UserAgent.create({
      role,
      user: user.id,
      reloadPermissions: true,
    });
    userAgent = userAgent.toObject();
    await addCenterProfilePermissionToUserAgents({ userAgentIds: userAgent.id, ctx });
    // ES: Si no tenia el perfil y no es nuevo usuario, le mandamos el email
    // EN: If the user didn't have the profile and it's not a new user, we send the email
    if (!isNewUser) {
      await sendNewProfileAddedEmailToUser({ user, profile, ctx });
      await sendActivationEmailsByProfileToUser({ user, profile, ctx });
    }
  } else if (userAgent.isDeleted) {
    userAgent = await ctx.tx.db.UserAgent.findOneAndUpdate(
      {
        role,
        user: user.id,
      },
      {
        isDeleted: false,
        deletedAt: null,
      },
      { new: true, lean: true }
    );
    await ctx.tx.emit('user-agent.restore', { userAgent });
  }
  return userAgent;
}

/**
 * Adds a user.
 *
 * @param {Object} params The parameters for adding a user.
 * @param {string} params.role The role of the user.
 * @param {string} params.id The ID of the user.
 * @param {Array<string>} params.tags The tags associated with the user.
 * @param {string} params.password The password for the user.
 * @param {Date} params.birthdate The birthdate of the user.
 * @param {string} params.avatar The avatar URL of the user.
 * @param {Date} params.createdAt The creation date of the user.
 * @param {any} params.dataset The dataset information of the user.
 * @param {UserProfile} params.profile The profile object of the user.
 * @param {MoleculerContext} params.ctx The Moleculer's context.
 * @returns {Promise<Object>} The newly added user object.
 */
async function addUser({
  role,
  id,
  tags,
  password,
  birthdate,
  avatar,
  createdAt,
  dataset,
  profile,
  ctx,
  ...userData
}) {
  const { user, isNewUser } = await handleUserCreationOrUpdate({
    id,
    userData: _.omit(userData, ['created_at']),
    birthdate,
    password,
    ctx,
  });

  if (dataset) {
    await setUserDatasetInfo({ userId: user.id, value: dataset, ctx });
  }

  const userAgent = await handleUserAgent({ user, role, isNewUser, profile, ctx });

  if (isNewUser) {
    await addUserAvatar({ user: { ...user, userAgents: [userAgent] }, avatar, ctx });
    await setUserForRegisterPassword({ userId: user.id, ctx });
    await sendWelcomeEmailToUser({ user, ctx });
  }

  if (tags && _.isArray(tags) && tags.length) {
    await ctx.tx.call('common.tags.setTagsToValues', {
      type: 'users.user-agent',
      tags,
      values: userAgent.id,
    });
  }

  const calendarPluginExists = await ctx.tx.call('deployment-manager.pluginIsInstalled', {
    pluginName: 'calendar',
  });

  if (userAgent && calendarPluginExists) {
    await addCalendarToUserAgentsIfNeedByUser({ user: user.id, ctx });
  }
  return user;
}

/**
 * @typedef {Object} AddUsersBulkData
 *
 * @property {string} center - The center ID.
 * @property {string} profile - The profile ID.
 * @property {Array.<{email: string, tags?: string[]}>} users - The list of users to add.
 */

/**
 * Adds multiple users in bulk.
 * @param {Object} params - The parameters.
 * @param {AddUsersBulkData} params.data - The data for adding users in bulk.
 * @param {MoleculerContext} params.ctx - The Moleculer's context.
 * @returns {Promise<any[]>} - The list of users added.
 */
async function addBulk({ data, ctx }) {
  const { center, profile, users } = data;
  validateAddUsersBulkForm(data);
  const [role, locale, _profile, _center] = await Promise.all([
    getRoleForRelationshipProfileCenter({ profileId: profile, centerId: center, ctx }),
    getDefaultLocale({ ctx }),
    ctx.tx.db.Profiles.findOne({ id: profile }).lean(),
    ctx.tx.db.Centers.findOne({ id: center }).lean(),
  ]);

  return Promise.all(
    _.map(users, (user) =>
      addUser({
        role: role.id,
        ...user,
        locale: user.locale || _center.locale || locale,
        status: 'created',
        active: user.active || false,
        profile: _profile,
        ctx,
      })
    )
  );
}

module.exports = { addBulk };
