const _ = require('lodash');
const { validateKeyPrefix, validateNotExistRoomKey } = require('../../validations/exists');

async function removeUserAgents({ key, userAgents: _userAgents, ignoreCalledFrom, ctx }) {
  if (!ignoreCalledFrom) validateKeyPrefix({ key, calledFrom: ctx.callerPlugin, ctx });

  const userAgents = _.isArray(_userAgents) ? _userAgents : [_userAgents];

  await validateNotExistRoomKey({ key, ctx });

  await ctx.tx.db.UserAgentInRoom.deleteMany({ room: key, userAgent: userAgents }, { soft: true });

  ctx.socket.emit(userAgents, `COMUNICA:ROOM:REMOVE`, { key });

  const currentUserAgents = await ctx.tx.db.UserAgentInRoom.find({ room: key })
    .select(['userAgent'])
    .lean();

  ctx.socket.emit(_.map(currentUserAgents, 'userAgent'), `COMUNICA:ROOM:USERS_REMOVED`, {
    key,
    userAgents,
  });

  return true;
}

module.exports = { removeUserAgents };
