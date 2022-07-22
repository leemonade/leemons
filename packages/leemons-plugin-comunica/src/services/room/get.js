const _ = require('lodash');
const { table } = require('../tables');
const {
  validateKeyPrefix,
  validateNotExistRoomKey,
  validateNotExistUserAgentInRoomKey,
} = require('../../validations/exists');

async function get(key, userAgent, { transacting: _transacting } = {}) {
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
      const [room, userAgents] = await Promise.all([
        table.room.findOne({ key }, { transacting }),
        table.userAgentInRoom.find({ room: key }, { transacting }),
      ]);

      room.userAgents = _.map(userAgents, (a) => ({ userAgent: a.userAgent, deleted: a.deleted }));

      return room;
    },
    table.room,
    _transacting
  );
}

module.exports = { get };
