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

async function addUserBulk(
  role,
  { tags, password, birthdate, ...userData },
  ctx,
  { transacting } = {}
) {
  const tagsService = leemons.getPlugin('common').services.tags;

  let user = await table.users.findOne({ email: userData.email }, { transacting });
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
  }

  let userAgent = await table.userAgent.findOne({ user: user.id, role }, { transacting });
  if (!userAgent) {
    userAgent = await table.userAgent.create(
      {
        role,
        user: user.id,
        reloadPermissions: true,
      },
      { transacting }
    );
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

async function addBulk(data, ctx, { transacting: _transacting } = {}) {
  const { center, profile, users } = data;
  return global.utils.withTransaction(
    async (transacting) => {
      validateAddUsersBulkForm(data);
      const [role, locale] = await Promise.all([
        getRoleForRelationshipProfileCenter(profile, center, { transacting }),
        getDefaultLocale({ transacting }),
      ]);

      return Promise.all(
        _.map(users, (user) =>
          addUserBulk(
            role.id,
            {
              ...user,
              locale,
              status: 'created',
              active: false,
            },
            ctx,
            { transacting }
          )
        )
      );
    },
    table.users,
    _transacting
  );
}

module.exports = { addBulk };
