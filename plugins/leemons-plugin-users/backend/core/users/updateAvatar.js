const _ = require('lodash');
const { addUserAvatar } = require('./addUserAvatar');

async function updateAvatar({ userId, avatar, ctx }) {
  const user = await ctx.tx.db.Users.findOne({ id: userId }).lean();

  if (!_.isUndefined(avatar)) {
    const userAgents = await ctx.tx.db.UserAgent.find({ user: user.id }).lean();
    const { avatar: url } = await addUserAvatar({ user: { ...user, userAgents }, avatar, ctx });
    // TODO migration: socket, por definir ctx.socket...
    ctx.socket.emitToAll('USER_CHANGE_AVATAR', { url });
  }

  return user;
}

module.exports = { updateAvatar };
