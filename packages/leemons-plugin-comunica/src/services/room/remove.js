const _ = require('lodash');
const { table } = require('../tables');
const { validateKeyPrefix, validateNotExistRoomKey } = require('../../validations/exists');
const { addUserAgents } = require('./addUserAgents');

async function remove(key, { transacting: _transacting } = {}) {
  validateKeyPrefix(key, this.calledFrom);

  return global.utils.withTransaction(
    async (transacting) => {
      await validateNotExistRoomKey(key, { transacting });

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

      return true;
    },
    table.room,
    _transacting
  );
}

module.exports = { remove };
