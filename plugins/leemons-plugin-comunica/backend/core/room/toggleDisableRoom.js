const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const {
  validateKeyPrefix,
  validateNotExistRoomKey,
  validateNotExistUserAgentInRoomKey,
} = require('../../validations/exists');

async function toggleDisableRoom({ key, userAgent, ctx }) {
  validateKeyPrefix({ key, calledFrom: ctx.callerPlugin, ctx });

  await validateNotExistRoomKey({ key, ctx });
  await validateNotExistUserAgentInRoomKey({ key, userAgent, ctx });

  const userAgentRoom = await ctx.tx.db.UserAgentInRoom.findOne({
    room: key,
    userAgent,
  }).lean();

  if (!userAgentRoom.isAdmin)
    throw new LeemonsError(ctx, { message: 'You don`t have permissions for disable this room' });

  const room = await ctx.tx.db.Room.findOne({ key }).select(['adminDisableMessages']).lean();

  await ctx.tx.db.Room.updateOne({ key }, { adminDisableMessages: !room.adminDisableMessages });

  const adminUserAgents = await ctx.tx.db.UserAgentInRoom.find({
    room: key,
  })
    .select(['userAgent'])
    .lean();

  ctx.socket.emit(_.map(adminUserAgents, 'userAgent'), `COMUNICA:ROOM:ADMIN_DISABLE_MESSAGES`, {
    room: key,
    adminDisableMessages: !room.adminDisableMessages,
  });

  return !room.adminDisableMessages;
}

module.exports = { toggleDisableRoom };
