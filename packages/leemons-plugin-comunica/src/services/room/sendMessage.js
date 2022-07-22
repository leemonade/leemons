/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');
const {
  validateKeyPrefix,
  validateNotExistRoomKey,
  validateNotExistUserAgentInRoomKey,
} = require('../../validations/exists');

async function sendMessage(key, _userAgent, message, { transacting: _transacting } = {}) {
  validateKeyPrefix(key, this.calledFrom);

  return global.utils.withTransaction(
    async (transacting) => {
      await validateNotExistRoomKey(key, { transacting });
      await validateNotExistUserAgentInRoomKey(key, _userAgent, { transacting });

      const [room, userAgent, userAgentsInRoom] = await Promise.all([
        table.room.findOne({ key }, { transacting }),
        table.userAgentInRoom.findOne({ room: key, _userAgent }, { transacting }),
        table.userAgentInRoom.find({ room: key }, { transacting }),
      ]);

      const userAgentsWithPermissions = await leemons
        .getPlugin('users')
        .services.permissions.getUserAgentsWithPermissionsForItem(
          key,
          'plugins.comunica.room.view',
          { transacting }
        );

      _.forEach(_.uniq(userAgentsInRoom.concat(userAgentsWithPermissions)), (userAgentInRoom) => {
        leemons.socket.emit(userAgentInRoom.userAgent, `COMUNICA:ROOM:${key}`, {
          type: 'message',
          message,
        });
      });

      if (room.useEncrypt) {
        message = global.utils.encrypt(message, userAgent.encryptKey);
      }

      return table.message.create(
        {
          room: key,
          userAgent: _userAgent,
          message: JSON.stringify(message),
          isEncrypt: room.useEncrypt,
        },
        { transacting }
      );
    },
    table.room,
    _transacting
  );
}

module.exports = { sendMessage };
