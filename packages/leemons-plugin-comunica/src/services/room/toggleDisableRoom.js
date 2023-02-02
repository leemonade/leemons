const _ = require('lodash');
const { table } = require('../tables');
const {
  validateKeyPrefix,
  validateNotExistRoomKey,
  validateNotExistUserAgentInRoomKey,
} = require('../../validations/exists');

async function toggleDisableRoom(key, userAgent, { transacting: _transacting } = {}) {
  validateKeyPrefix(key, this.calledFrom);

  return global.utils.withTransaction(
    async (transacting) => {
      await validateNotExistRoomKey(key, { transacting });
      await validateNotExistUserAgentInRoomKey(key, userAgent, { transacting });

      const userAgentRoom = await table.userAgentInRoom.findOne(
        {
          room: key,
          userAgent,
        },
        { transacting }
      );

      if (!userAgentRoom.isAdmin)
        throw new Error('You don`t have permissions for disable this room');

      const room = await table.room.findOne({ key }, { transacting });

      await table.room.update(
        { key },
        { adminDisableMessages: !room.adminDisableMessages },
        { transacting }
      );

      const adminUserAgents = await table.userAgentInRoom.find(
        {
          room: key,
        },
        { columns: ['userAgent'], transacting }
      );

      leemons.socket.emit(
        _.map(adminUserAgents, 'userAgent'),
        `COMUNICA:ROOM:ADMIN_DISABLE_MESSAGES`,
        { room: key, adminDisableMessages: !room.adminDisableMessages }
      );

      return !room.adminDisableMessages;
    },
    table.room,
    _transacting
  );
}

module.exports = { toggleDisableRoom };
