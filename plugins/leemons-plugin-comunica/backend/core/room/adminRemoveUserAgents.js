const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const {
  validateKeyPrefix,
  validateNotExistRoomKey,
  validateNotExistUserAgentInRoomKey,
} = require('../../validations/exists');
const { removeUserAgents } = require('./removeUserAgents');

async function adminRemoveUserAgents({ key, userAgents, userAgentAdmin, ctx }) {
  validateKeyPrefix({ key, calledFrom: ctx.callerPlugin, ctx });
  await validateNotExistRoomKey({ key, ctx });
  await validateNotExistUserAgentInRoomKey({ key, userAgent: userAgentAdmin, ctx });
  const admin = await ctx.tx.db.UserAgentInRoom.findOne({
    room: key,
    userAgent: userAgentAdmin,
  })
    .select(['isAdmin'])
    .lean();

  if (!admin.isAdmin)
    throw new LeemonsError(ctx, {
      message: 'You don`t have permissions for remove users in this room',
    });

  return removeUserAgents({ key, userAgents, ignoreCalledFrom: true, ctx });
}

module.exports = { adminRemoveUserAgents };
