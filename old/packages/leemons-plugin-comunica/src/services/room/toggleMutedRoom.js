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
