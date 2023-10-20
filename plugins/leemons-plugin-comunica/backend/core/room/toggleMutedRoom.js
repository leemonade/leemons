const _ = require('lodash');
const {
  validateKeyPrefix,
  validateNotExistRoomKey,
  validateNotExistUserAgentInRoomKey,
} = require('../../validations/exists');

async function toggleMutedRoom({ key, userAgent, ctx }) {
  validateKeyPrefix({ key, calledFrom: ctx.callerPlugin, ctx });

  await validateNotExistRoomKey({ key, ctx });
  await validateNotExistUserAgentInRoomKey({ key, userAgent, ctx });

  let userAgentRoom = await ctx.tx.db.UserAgentInRoom.findOne({
    room: key,
    userAgent,
  }).lean();

  userAgentRoom = await ctx.tx.db.UserAgentInRoom.findOneAndUpdate(
    { id: userAgentRoom.id },
    { muted: !userAgentRoom.muted },
    { new: true, lean: true }
  );

  ctx.socket.emit(userAgent, `COMUNICA:CONFIG:ROOM`, userAgentRoom);

  return userAgentRoom.muted;
}

module.exports = { toggleMutedRoom };
