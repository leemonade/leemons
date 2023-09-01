const _ = require('lodash');
const {
  validateKeyPrefix,
  validateNotExistRoomKey,
  validateNotExistUserAgentInRoomKey,
} = require('../../validations/exists');
const { addUserAgents } = require('./addUserAgents');
const { LeemonsError } = require('leemons-error');

async function adminAddUserAgents({ key, userAgents, userAgentAdmin, ctx }) {
  validateKeyPrefix({ key, calledFrom: ctx.callerPlugin, ctx });
  await validateNotExistRoomKey({ key, ctx });
  await validateNotExistUserAgentInRoomKey({ key, userAgent: userAgentAdmin, ctx });
  const admin = await ctx.tx.db.UserAgentInRoom.findOne({
    room: key,
    userAgent: userAgentAdmin,
  }).lean();

  if (!admin.isAdmin)
    throw new LeemonsError(ctx, {
      message: 'You don`t have permissions for remove users in this room',
    });

  return addUserAgents({ key, userAgents, ignoreCalledFrom: true, ctx });
}

module.exports = { adminAddUserAgents };
