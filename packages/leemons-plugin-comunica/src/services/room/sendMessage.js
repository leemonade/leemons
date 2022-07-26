/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');
const {
  validateKeyPrefix,
  validateNotExistRoomKey,
  validateNotExistUserAgentInRoomKey,
} = require('../../validations/exists');

async function setMessageUnRead(key, userAgentId, message, { transacting } = {}) {
  const count = await table.roomMessagesUnRead.count(
    {
      room: key,
      userAgent: userAgentId,
    },
    { transacting }
  );
  if (count) return null;
  return table.roomMessagesUnRead.set(
    {
      room: key,
      userAgent: userAgentId,
    },
    {
      room: key,
      userAgent: userAgentId,
      message,
    },
    { transacting }
  );
}

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

      const userAgentIds = _.uniq(
        _.map(userAgentsInRoom, 'userAgent').concat(userAgentsWithPermissions)
      );
      const promises = [];

      const response = await table.message.create(
        {
          room: key,
          userAgent: _userAgent,
          message: JSON.stringify(
            room.useEncrypt ? global.utils.encrypt(message, userAgent.encryptKey) : message
          ),
          isEncrypt: room.useEncrypt,
        },
        { transacting }
      );

      _.forEach(userAgentIds, (userAgentId) => {
        promises.push(setMessageUnRead(key, userAgentId, response.id, { transacting }));
      });

      await Promise.all(promises);

      _.forEach(userAgentIds, (userAgentId) => {
        leemons.socket.emit(userAgentId, `COMUNICA:ROOM:${key}`, {
          type: 'message',
          message,
        });
      });

      return response;
    },
    table.room,
    _transacting
  );
}

module.exports = { sendMessage };
