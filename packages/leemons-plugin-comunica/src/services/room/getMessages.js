/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');
const {
  validateKeyPrefix,
  validateNotExistRoomKey,
  validateNotExistUserAgentInRoomKey,
} = require('../../validations/exists');

async function getMessages(key, userAgent, { transacting: _transacting } = {}) {
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
      const [userAgentsInRoom, messages] = await Promise.all([
        table.userAgentInRoom.find({ room: key, deleted_$null: false }, { transacting }),
        table.message.find({ room: key, $sort: 'created_at:ASC' }, { transacting }),
      ]);

      const userAgentsById = _.keyBy(userAgentsInRoom, 'userAgent');

      _.forEach(messages, (message) => {
        message.message = JSON.parse(message.message);
        if (message.isEncrypt) {
          message.message = global.utils.decrypt(
            message.message,
            userAgentsById[message.userAgent].encryptKey
          );
        }
      });

      return messages;
    },
    table.room,
    _transacting
  );
}

module.exports = { getMessages };
