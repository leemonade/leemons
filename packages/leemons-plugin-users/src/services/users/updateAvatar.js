const _ = require('lodash');
const { table } = require('../tables');
const { addUserAvatar } = require('./addUserAvatar');

async function updateAvatar(userId, avatar, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const user = await table.users.findOne({ id: userId }, { transacting });

      if (!_.isUndefined(avatar)) {
        const userAgents = await table.userAgent.find({ user: user.id }, { transacting });
        await addUserAvatar({ ...user, userAgents }, avatar, { transacting });
        leemons.socket.emit(userId, 'USER_CHANGE_AVATAR');
      }

      return user;
    },
    table.users,
    _transacting
  );
}

module.exports = { updateAvatar };
