const _ = require('lodash');
const { table } = require('../tables');
const {
  validateKeyPrefix,
  validateNotExistRoomKey,
  validateNotExistUserAgentInRoomKey,
} = require('../../validations/exists');

async function adminUpdateRoomName(key, userAgent, name, { transacting: _transacting } = {}) {
  validateKeyPrefix(key, this.calledFrom);

  return global.utils.withTransaction(
    async (transacting) => {
      await validateNotExistRoomKey(key, { transacting });
      await validateNotExistUserAgentInRoomKey(key, userAgent, { transacting });

      const userAgentInRoom = await table.userAgentInRoom.findOne(
        {
          room: key,
          userAgent,
        },
        { transacting }
      );

      if (!userAgentInRoom.isAdmin)
        throw new Error('You don`t have permissions for change the name of this room');

      const room = await table.room.update({ key }, { name }, { transacting });

      const userAgentsInRoom = await table.userAgentInRoom.find(
        {
          room: key,
        },
        { columns: ['userAgent'], transacting }
      );

      leemons.socket.emit(_.map(userAgentsInRoom, 'userAgent'), `COMUNICA:ROOM:UPDATE:NAME`, room);

      return room;
    },
    table.room,
    _transacting
  );
}

module.exports = { adminUpdateRoomName };
