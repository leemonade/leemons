/* eslint-disable no-param-reassign */
const { validateKeyPrefix } = require('../../validations/exists');

async function markAsRead({ key, userAgentId, ctx }) {
  validateKeyPrefix({ key, calledFrom: ctx.callerPlugin, ctx });
  const count = await ctx.tx.db.RoomMessagesUnRead.countDocuments({
    room: key,
    userAgent: userAgentId,
  });
  if (!count) return null;
  await ctx.socket.emit(userAgentId, `COMUNICA:ROOM:READED:${key}`);
  return ctx.tx.db.RoomMessagesUnRead.deleteOne({
    room: key,
    userAgent: userAgentId,
  });
}

module.exports = { markAsRead };
