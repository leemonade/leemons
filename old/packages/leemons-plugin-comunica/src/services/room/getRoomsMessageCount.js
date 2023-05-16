/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');
const {
  validateKeyPrefix,
  validateNotExistRoomKey,
  validateNotExistUserAgentInRoomKey,
} = require('../../validations/exists');

function validatePermissionsInAllRooms(keys, userAgent, { transacting }) {
  return Promise.all(
    keys.map(async (key) => {
      validateKeyPrefix(key, this.calledFrom);

      await validateNotExistRoomKey(key, { transacting });
      try {
        await validateNotExistUserAgentInRoomKey(key, userAgent, { transacting });
      } catch (error) {
        // Si el usuario no esta en la sala, comprobamos si tiene permisos para ver el item
        const hasPermission = await leemons
          .getPlugin('users')
          .services.permissions.userAgentHasPermissionToItem(userAgent, key, { transacting });
        if (!hasPermission) throw error;
      }
    })
  );
}

async function getRoomsMessageCount(keys, userAgent, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validatePermissionsInAllRooms.call(this, keys, userAgent, { transacting });

      const messagesCount = await table.message.count({ room_$in: keys }, { transacting });

      return messagesCount;
    },
    table.room,
    _transacting
  );
}

module.exports = { getRoomsMessageCount };
