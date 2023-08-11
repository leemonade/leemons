/* eslint-disable no-param-reassign */
const _ = require('lodash');
const Filter = require('bad-words');
const { table } = require('../tables');
const {
  validateKeyPrefix,
  validateNotExistRoomKey,
  validateNotExistUserAgentInRoomKey,
} = require('../../validations/exists');
const { getCenter } = require('../config/getCenter');

async function setMessageUnRead(key, userAgentId, message, { transacting } = {}) {
  const item = await table.roomMessagesUnRead.findOne(
    {
      room: key,
      userAgent: userAgentId,
    },
    { transacting }
  );
  return table.roomMessagesUnRead.set(
    {
      room: key,
      userAgent: userAgentId,
    },
    {
      room: key,
      userAgent: userAgentId,
      message,
      count: item && item.count ? item.count + 1 : 1,
    },
    { transacting }
  );
}

async function sendMessage(key, _userAgent, _message, { transacting: _transacting } = {}) {
  validateKeyPrefix(key, this.calledFrom);

  return global.utils.withTransaction(
    async (transacting) => {
      await validateNotExistRoomKey(key, { transacting });
      await validateNotExistUserAgentInRoomKey(key, _userAgent.id, { transacting });

      const [room, userAgent, userAgentsInRoom] = await Promise.all([
        table.room.findOne({ key }, { transacting }),
        table.userAgentInRoom.findOne({ room: key, userAgent: _userAgent.id }, { transacting }),
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

      const message = _message;
      if (message.type === 'text') {
        const center = await leemons
          .getPlugin('users')
          .services.users.getUserAgentCenter(_userAgent, { transacting });
        const centerConfig = await getCenter(center.id, { transacting });

        if (centerConfig.enableSecureWords) {
          const words = _.map(centerConfig.secureWords.split(','), (word) => word.trim());
          const filter = new Filter({ list: words });
          message.content = filter.clean(message.content);
        }
      }

      const response = await table.message.create(
        {
          room: key,
          userAgent: _userAgent.id,
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

      await leemons.socket.emit(userAgentIds, `COMUNICA:ROOM:${key}`, {
        ...response,
        message,
      });

      return response;
    },
    table.room,
    _transacting
  );
}

module.exports = { sendMessage };
