const _ = require('lodash');
const { table } = require('../tables');
const {
  validateKeyPrefix,
  validateNotExistRoomKey,
  validateNotExistUserAgentInRoomKey,
} = require('../../validations/exists');

async function toggleAdminMutedRoom(
  key,
  userAgent,
  userAgentAdmin,
  { transacting: _transacting } = {}
) {
  validateKeyPrefix(key, this.calledFrom);

  return global.utils.withTransaction(
    async (transacting) => {
      await validateNotExistRoomKey(key, { transacting });
      await Promise.all([
        validateNotExistUserAgentInRoomKey(key, userAgent, { transacting }),
        validateNotExistUserAgentInRoomKey(key, userAgentAdmin, { transacting }),
      ]);

      // eslint-disable-next-line prefer-const
      let [userAgentAdminRoom, userAgentRoom] = await Promise.all([
        table.userAgentInRoom.findOne(
          {
            room: key,
            userAgent: userAgentAdmin,
          },
          { transacting }
        ),
        table.userAgentInRoom.findOne(
          {
            room: key,
            userAgent,
          },
          { transacting }
        ),
      ]);

      if (!userAgentAdminRoom.isAdmin)
        throw new Error('You don`t have permissions for mute users in this room');

      userAgentRoom = await table.userAgentInRoom.update(
        { id: userAgentRoom.id },
        { adminMuted: !userAgentRoom.adminMuted },
        { transacting }
      );

      const adminUserAgents = await table.userAgentInRoom.find(
        {
          room: key,
          isAdmin: true,
        },
        { columns: ['userAgent'], transacting }
      );

      leemons.socket.emit(
        _.map(adminUserAgents, 'userAgent'),
        `COMUNICA:ROOM:ADMIN_MUTED`,
        userAgentRoom
      );

      leemons.socket.emit(userAgent, `COMUNICA:CONFIG:ROOM`, userAgentRoom);

      return userAgentRoom.adminMuted;
    },
    table.room,
    _transacting
  );
}

module.exports = { toggleAdminMutedRoom };
