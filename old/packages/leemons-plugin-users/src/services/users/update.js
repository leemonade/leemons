const _ = require('lodash');
const { table } = require('../tables');
const { setUserDatasetInfo } = require('../user-agents/setUserDatasetInfo');
const { setPreferences } = require('../user-preferences/setPreferences');
const { addUserAvatar } = require('./addUserAvatar');

async function update(
  userId,
  { dataset, birthdate, preferences, avatar, ...data },
  { userSession, transacting: _transacting } = {}
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

      if (dataset) await setUserDatasetInfo(userId, dataset, { userSession, transacting });

      if (oldUser.locale !== user.locale) {
        leemons.socket.emit(userId, 'USER_CHANGE_LOCALE', {
          old: oldUser.locale,
          new: user.locale,
        });
      }

      if (!_.isUndefined(avatar)) {
        const userAgents = await table.userAgent.find({ user: user.id }, { transacting });
        const { avatar: url } = await addUserAvatar({ ...user, userAgents }, avatar, {
          transacting,
        });
        leemons.socket.emitToAll('USER_CHANGE_AVATAR', { url });
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
