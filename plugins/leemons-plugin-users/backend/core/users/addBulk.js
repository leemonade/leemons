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

async function addUserBulk({
  role,
  id,
  tags,
  password,
  birthdate,
  avatar,
  // eslint-disable-next-line camelcase
  created_at,
  dataset,
  profile,
  ctx,
  ...userData
}) {
  let user = null;
  if (id) {
    user = await ctx.tx.db.Users.findOne({ id }).lean();
  } else {
    user = await ctx.tx.db.Users.findOne({ email: userData.email }).lean();
  }
  let isNewUser = false;
  console.log('user', user);
  if (!user) {
    user = await ctx.tx.db.Users.create({
      ...userData,
      birthdate,
      password: password ? await encryptPassword(password) : undefined,
    });
    user = user.toObject();
    await setUserForRegisterPassword({ userId: user.id, ctx });
    await sendWelcomeEmailToUser({ user, ctx });
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
  if (dataset) await setUserDatasetInfo({ userId: user.id, value: dataset, ctx });

  let userAgent = await ctx.tx.db.UserAgent.findOne(
    {
      user: user.id,
      role,
    },
    undefined,
    { excludeDeleted: false }
  ).lean();
  console.log('userAgent', userAgent, {
    user: user.id,
    role,
  });
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
    if (!isNewUser) {
      await sendNewProfileAddedEmailToUser({ user, profile, ctx });
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

  if (isNewUser) {
    await addUserAvatar({ user: { ...user, userAgents: [userAgent] }, avatar, ctx });
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

  if (calendarPluginExists) {
    await addCalendarToUserAgentsIfNeedByUser({ user: user.id, ctx });
  }
  return user;
}

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
      addUserBulk({
        role: role.id,
        ...user,
        locale: user.locale || _center.locale || locale,
        status: 'created',
        active: false,
        profile: _profile,
        ctx,
      })
    )
  );
}

module.exports = { addBulk };
