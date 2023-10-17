const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const {
  validateKeyPrefix,
  validateNotExistRoomKey,
  validateNotExistUserAgentInRoomKey,
} = require('../../validations/exists');

async function adminUpdateRoomName({ key, userAgent, name, ctx }) {
  validateKeyPrefix({ key, calledFrom: ctx.callerPlugin, ctx });

  await validateNotExistRoomKey({ key, ctx });
  await validateNotExistUserAgentInRoomKey({ key, userAgent, ctx });

  const userAgentInRoom = await ctx.tx.db.UserAgentInRoom.findOne({
    room: key,
    userAgent,
  })
    .select(['isAdmin'])
    .lean();

  if (!userAgentInRoom.isAdmin)
    throw new LeemonsError(ctx, {
      message: 'You don`t have permissions for change the name of this room',
    });

  const room = await ctx.tx.db.Room.findOneAndUpdate({ key }, { name }, { new: true, lean: true });

  const userAgentsInRoom = await ctx.tx.db.UserAgentInRoom.find({
    room: key,
  })
    .select(['userAgent'])
    .lean();

  ctx.socket.emit(_.map(userAgentsInRoom, 'userAgent'), `COMUNICA:ROOM:UPDATE:NAME`, room);

  return room;
}

module.exports = { adminUpdateRoomName };
