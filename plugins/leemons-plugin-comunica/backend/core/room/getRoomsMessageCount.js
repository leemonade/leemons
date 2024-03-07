/* eslint-disable no-param-reassign */
const _ = require('lodash');
const {
  validateKeyPrefix,
  validateNotExistRoomKey,
  validateNotExistUserAgentInRoomKey,
} = require('../../validations/exists');

function validatePermissionsInAllRooms({ keys, userAgent, ctx }) {
  return Promise.all(
    keys.map(async (key) => {
      validateKeyPrefix({ key, calledFrom: ctx.callerPlugin, ctx });

      await validateNotExistRoomKey({ key, ctx });
      try {
        await validateNotExistUserAgentInRoomKey({ key, userAgent, ctx });
      } catch (error) {
        // Si el usuario no esta en la sala, comprobamos si tiene permisos para ver el item
        const hasPermission = await ctx.tx.call('users.permissions.userAgentHasPermissionToItem', {
          userAgentId: userAgent,
          item: key,
        });
        if (!hasPermission) throw error;
      }
    })
  );
}

async function getRoomsMessageCount({ keys, userAgent, ctx }) {
  await validatePermissionsInAllRooms({ keys, userAgent, ctx });

  return ctx.tx.db.Message.countDocuments({ room: keys });
}

module.exports = { getRoomsMessageCount };
