const _ = require('lodash');
const { table } = require('../tables');
const {
  validateKeyPrefix,
  validateNotExistRoomKey,
  validateNotExistUserAgentInRoomKey,
} = require('../../validations/exists');

async function toggleAttachedRoom(key, userAgent, { transacting: _transacting } = {}) {
  validateKeyPrefix(key, this.calledFrom);

  return global.utils.withTransaction(
    async (transacting) => {
      await validateNotExistRoomKey(key, { transacting });
      await validateNotExistUserAgentInRoomKey(key, userAgent, { transacting });

      let userAgentRoom = await table.userAgentInRoom.findOne(
        {
          room: key,
          userAgent,
        },
        { transacting }
      );

      userAgentRoom = await table.userAgentInRoom.update(
        { id: userAgentRoom.id },
        { attached: userAgentRoom.attached ? null : new Date() },
        { transacting }
      );

      leemons.socket.emit(userAgent, `COMUNICA:CONFIG:ROOM`, userAgentRoom);

      return userAgentRoom.attached;
    },
    table.room,
    _transacting
  );
}

module.exports = { toggleAttachedRoom };
