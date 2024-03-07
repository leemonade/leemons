const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const {
  validateKeyPrefix,
  validateNotExistRoomKey,
  validateNotExistUserAgentInRoomKey,
} = require('../../validations/exists');
const { remove } = require('./remove');

async function adminRemoveRoom({ key, userAgentAdmin, ctx }) {
  validateKeyPrefix({ key, calledFrom: ctx.callerPlugin, ctx });
  await validateNotExistRoomKey({ key, ctx });
  await validateNotExistUserAgentInRoomKey({ key, userAgent: userAgentAdmin, ctx });
  const admin = await ctx.tx.db.UserAgentInRoom.findOne({
    room: key,
    userAgent: userAgentAdmin,
  }).lean();

  if (!admin.isAdmin)
    throw new LeemonsError(ctx, { message: 'You don`t have permissions for remove this room' });

  return remove({ key, ignoreCalledFrom: true, ctx });
}

module.exports = { adminRemoveRoom };
