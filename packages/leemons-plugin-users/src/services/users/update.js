const _ = require('lodash');
const { table } = require('../tables');
const { setPreferences } = require('../user-preferences/setPreferences');
const { addUserAvatar } = require('./addUserAvatar');

async function update(
  userId,
  { birthdate, preferences, avatar, ...data },
  { transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      const oldUser = await table.users.findOne({ id: userId }, { transacting });
      const user = await table.users.update(
        { id: userId },
        {
          birthdate: birthdate ? global.utils.sqlDatetime(birthdate) : birthdate,
          ...data,
        },
        { transacting }
      );

      if (oldUser.locale !== user.locale) {
        leemons.socket.emit(userId, 'USER_CHANGE_LOCALE', {
          old: oldUser.locale,
          new: user.locale,
        });
      }

      if (!_.isUndefined(avatar)) {
        const userAgents = await table.userAgent.find({ user: user.id }, { transacting });
        await addUserAvatar({ ...user, userAgents }, avatar, { transacting });
      }

      if (preferences) {
        await setPreferences(user.id, preferences, { transacting });
      }

      return user;
    },
    table.users,
    _transacting
  );
}

module.exports = { update };
