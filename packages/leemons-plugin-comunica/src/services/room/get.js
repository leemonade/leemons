const _ = require('lodash');
const { table } = require('../tables');
const {
  validateKeyPrefix,
  validateNotExistRoomKey,
  validateNotExistUserAgentInRoomKey,
} = require('../../validations/exists');

async function get(key, userAgent, { returnUserAgents, transacting: _transacting } = {}) {
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
      const [room, userAgents, nMessages, messagesUnread] = await Promise.all([
        table.room.findOne({ key }, { transacting }),
        table.userAgentInRoom.find({ room: key }, { transacting }),
        table.message.count({ room: key }, { transacting }),
        table.roomMessagesUnRead.findOne(
          {
            room: key,
            userAgent,
          },
          { transacting }
        ),
      ]);

      room.unreadMessages = messagesUnread ? messagesUnread.count : 0;
      room.messages = nMessages;
      room.userAgents = _.map(userAgents, (a) => ({ userAgent: a.userAgent, deleted: a.deleted }));

      if (returnUserAgents) {
        const userAgen = await leemons
          .getPlugin('users')
          .services.users.getUserAgentsInfo(_.map(userAgents, 'userAgent'), { withProfile: true });
        const userAgentsById = _.keyBy(userAgen, 'id');
        room.userAgents = _.map(userAgents, (a) => ({
          userAgent: userAgentsById[a.userAgent],
          deleted: a.deleted,
        }));
      }

      return room;
    },
    table.room,
    _transacting
  );
}

module.exports = { get };
