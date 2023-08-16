const _ = require('lodash');
const { table } = require('../tables');
const { validateKeyPrefix, validateNotExistRoomKey } = require('../../validations/exists');

async function remove(key, { ignoreCalledFrom, transacting: _transacting } = {}) {
  if (!ignoreCalledFrom) validateKeyPrefix(key, this.calledFrom);

  return global.utils.withTransaction(
    async (transacting) => {
      await validateNotExistRoomKey(key, { transacting });

      const userAgents = await table.userAgentInRoom.find({ room: key }, { transacting });

      await Promise.all([
        table.room.delete({ key }, { transacting }),
        table.userAgentInRoom.deleteMany({ room: key }, { transacting }),
        table.message.deleteMany({ room: key }, { transacting }),
        leemons.getPlugin('users').services.permissions.removeItems(
          {
            type: 'plugins.comunica.room.view',
            item: key,
          },
          { transacting }
        ),
      ]);

      leemons.socket.emit(_.map(userAgents, 'userAgent'), `COMUNICA:CONFIG:ROOM:REMOVE`, { key });

      return true;
    },
    table.room,
    _transacting
  );
}

module.exports = { remove };
