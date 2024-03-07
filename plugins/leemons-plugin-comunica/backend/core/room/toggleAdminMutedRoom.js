const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const {
  validateKeyPrefix,
  validateNotExistRoomKey,
  validateNotExistUserAgentInRoomKey,
} = require('../../validations/exists');

async function toggleAdminMutedRoom({ key, userAgent, userAgentAdmin, ctx }) {
  validateKeyPrefix({ key, calledFrom: ctx.callerPlugin, ctx });

  await validateNotExistRoomKey(key, { transacting });
  await Promise.all([
    validateNotExistUserAgentInRoomKey(key, userAgent, { transacting }),
    validateNotExistUserAgentInRoomKey(key, userAgentAdmin, { transacting }),
  ]);

  // eslint-disable-next-line prefer-const
  let [userAgentAdminRoom, userAgentRoom] = await Promise.all([
    ctx.tx.db.UserAgentInRoom.findOne({
      room: key,
      userAgent: userAgentAdmin,
    })
      .select(['isAdmin'])
      .lean(),
    ctx.tx.db.UserAgentInRoom.findOne({
      room: key,
      userAgent,
    }).lean(),
  ]);

  if (!userAgentAdminRoom.isAdmin)
    throw new LeemonsError(ctx, {
      message: 'You don`t have permissions for mute users in this room',
    });

  userAgentRoom = await ctx.tx.db.UserAgentInRoom.findOneAndUpdate(
    { id: userAgentRoom.id },
    { adminMuted: !userAgentRoom.adminMuted },
    { lean: true, new: true }
  );

  const adminUserAgents = await ctx.tx.db.UserAgentInRoom.find({
    room: key,
    isAdmin: true,
  })
    .select(['userAgent'])
    .lean();

  ctx.socket.emit(_.map(adminUserAgents, 'userAgent'), `COMUNICA:ROOM:ADMIN_MUTED`, userAgentRoom);

  ctx.socket.emit(userAgent, `COMUNICA:CONFIG:ROOM`, userAgentRoom);

  return userAgentRoom.adminMuted;
}

module.exports = { toggleAdminMutedRoom };
