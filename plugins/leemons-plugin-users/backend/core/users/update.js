const _ = require('lodash');
const { setUserDatasetInfo } = require('../user-agents/setUserDatasetInfo');
const { setPreferences } = require('../user-preferences/setPreferences');
const { addUserAvatar } = require('./addUserAvatar');

async function update({ userId, dataset, birthdate, preferences, avatar, ctx, ...data }) {
  const oldUser = await ctx.tx.db.Users.findOne({ id: userId }).lean();
  const user = await ctx.tx.db.Users.findOneAndUpdate(
    { id: userId },
    {
      birthdate,
      ...data,
    },
    { new: true, lean: true }
  );

  if (dataset) await setUserDatasetInfo({ userId, value: dataset, ctx });

  if (oldUser.locale !== user.locale) {
    ctx.socket.emit(userId, 'USER_CHANGE_LOCALE', {
      old: oldUser.locale,
      new: user.locale,
    });
  }

  if (!_.isUndefined(avatar)) {
    const userAgents = await ctx.tx.db.UserAgent.find({ user: user.id }).lean();
    const { avatar: url } = await addUserAvatar({ user: { ...user, userAgents }, avatar, ctx });
    // TODO migration: socket, por definir ctx.socket...
    ctx.socket.emitToAll('USER_CHANGE_AVATAR', { url });
  }

  if (preferences) {
    await setPreferences({ user: user.id, values: preferences, ctx });
  }

  return user;
}

module.exports = { update };
