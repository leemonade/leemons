const _ = require('lodash');
const { table } = require('../tables');
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

async function addUserBulk(
  role,
  { id, tags, password, birthdate, avatar, created_at, active, dataset, ...userData },
  ctx,
  { profile, transacting, userSession } = {}
) {
  const tagsService = leemons.getPlugin('common').services.tags;

  let user = null;
  if (id) {
    user = await table.users.findOne({ id }, { transacting });
  } else {
    user = await table.users.findOne({ email: userData.email }, { transacting });
  }
  let isNewUser = false;
  if (!user) {
    user = await table.users.create(
      {
        ...userData,
        birthdate: birthdate ? global.utils.sqlDatetime(birthdate) : birthdate,
        password: password ? await encryptPassword(password) : undefined,
      },
      {
        transacting,
      }
    );
    await setUserForRegisterPassword(user.id, { transacting });
    await sendWelcomeEmailToUser(user, ctx, { transacting });
    isNewUser = true;
  } else if (id) {
    await table.users.update(
      { id },
      {
        ...userData,
        birthdate: birthdate ? global.utils.sqlDatetime(birthdate) : birthdate,
      },
      {
        transacting,
      }
    );
  }
  if (dataset) await setUserDatasetInfo(user.id, dataset, { userSession, transacting });

  let userAgent = await table.userAgent.findOne(
    {
      $or: [{ deleted_$null: false }, { deleted_$ne: false }],
      user: user.id,
      role,
    },
    { transacting }
  );
  if (!userAgent) {
    await checkIfCanCreateNUserAgentsInRoleProfiles(1, role, { transacting });
    userAgent = await table.userAgent.create(
      {
        role,
        user: user.id,
        reloadPermissions: true,
      },
      { transacting }
    );
    await addCenterProfilePermissionToUserAgents(userAgent.id, { transacting });
    // ES: Si no tenia el perfil y no es nuevo usuario, le mandamos el email
    if (!isNewUser) {
      await sendNewProfileAddedEmailToUser(user, profile, ctx, { transacting });
    }
  } else if (userAgent.deleted) {
    userAgent = await table.userAgent.update(
      {
        $or: [{ deleted_$null: false }, { deleted_$ne: false }],
        role,
        user: user.id,
      },
      {
        deleted: false,
        deleted_at: null,
      },
      { transacting }
    );
    await leemons.events.emit('user-agent:restore', { userAgent, transacting });
  }

  if (isNewUser) {
    await addUserAvatar({ ...user, userAgents: [userAgent] }, avatar, { transacting });
  }

  if (tags && _.isArray(tags) && tags.length) {
    await tagsService.setTagsToValues('plugins.users.user-agent', tags, userAgent.id, {
      transacting,
    });
  }

  if (leemons.getPlugin('calendar')) {
    await addCalendarToUserAgentsIfNeedByUser(user.id, { transacting });
  }
  return user;
}

async function addBulk(data, ctx, { userSession, transacting: _transacting } = {}) {
  const { center, profile, users } = data;
  return global.utils.withTransaction(
    async (transacting) => {
      validateAddUsersBulkForm(data);
      const [role, locale, _profile, _center] = await Promise.all([
        getRoleForRelationshipProfileCenter(profile, center, { transacting }),
        getDefaultLocale({ transacting }),
        table.profiles.findOne({ id: profile }, { transacting }),
        table.centers.findOne({ id: center }, { transacting }),
      ]);

      return Promise.all(
        _.map(users, (user) =>
          addUserBulk(
            role.id,
            {
              ...user,
              locale: user.locale || _center.locale || locale,
              status: 'created',
              active: false,
            },
            ctx,
            { profile: _profile, userSession, transacting }
          )
        )
      );
    },
    table.users,
    _transacting
  );
}

module.exports = { addBulk };
