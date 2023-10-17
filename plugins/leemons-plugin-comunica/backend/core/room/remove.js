const _ = require('lodash');
const { validateKeyPrefix, validateNotExistRoomKey } = require('../../validations/exists');

async function remove({ key, ignoreCalledFrom, ctx }) {
  if (!ignoreCalledFrom) validateKeyPrefix({ key, calledFrom: ctx.callerPlugin, ctx });

  await validateNotExistRoomKey({ key, ctx });

  const userAgents = await ctx.tx.db.UserAgentInRoom.find({ room: key }).lean();

  await Promise.all([
    ctx.tx.db.Room.deleteOne({ key }),
    ctx.tx.db.UserAgentInRoom.deleteMany({ room: key }),
    ctx.tx.db.Message.deleteMany({ room: key }),
    ctx.tx.call('users.permissions.removeItems', {
      query: {
        type: 'comunica.room.view',
        item: key,
      },
    }),
  ]);

  ctx.socket.emit(_.map(userAgents, 'userAgent'), `COMUNICA:CONFIG:ROOM:REMOVE`, { key });
}

module.exports = { remove };
