const _ = require('lodash');
const { table } = require('../tables');
const {
  validateKeyPrefix,
  validateNotExistRoomKey,
  validateNotExistUserAgentInRoomKey,
} = require('../../validations/exists');

async function toggleMutedRoom(key, userAgent, { transacting: _transacting } = {}) {
  validateKeyPrefix(key, this.calledFrom);

  return global.utils.withTransaction(
    async (transacting) => {
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

      let userAgentRoom = await table.userAgentInRoom.findOne(
        {
          room: key,
          userAgent,
        },
        { transacting }
      );

      userAgentRoom = await table.userAgentInRoom.update(
        { id: userAgentRoom.id },
        { muted: !userAgentRoom.muted },
        { transacting }
      );

      leemons.socket.emit(userAgent, `COMUNICA:CONFIG:ROOM`, userAgentRoom);

      return userAgentRoom.muted;
    },
    table.room,
    _transacting
  );
}

module.exports = { toggleMutedRoom };
