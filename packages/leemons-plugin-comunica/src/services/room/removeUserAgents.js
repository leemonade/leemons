const _ = require('lodash');
const { table } = require('../tables');
const { validateKeyPrefix, validateNotExistRoomKey } = require('../../validations/exists');

async function removeUserAgents(
  key,
  _userAgents,
  { ignoreCalledFrom, transacting: _transacting } = {}
) {
  if (!ignoreCalledFrom) validateKeyPrefix(key, this.calledFrom);

  const userAgents = _.isArray(_userAgents) ? _userAgents : [_userAgents];

  return global.utils.withTransaction(
    async (transacting) => {
      await validateNotExistRoomKey(key, { transacting });

      await table.userAgentInRoom.deleteMany(
        { room: key, userAgent_$in: userAgents },
        {
          soft: true,
          transacting,
        }
      );

      leemons.socket.emit(userAgents, `COMUNICA:ROOM:REMOVE`, { key });

      const currentUserAgents = await table.userAgentInRoom.find(
        { room: key },
        {
          transacting,
        }
      );

      leemons.socket.emit(_.map(currentUserAgents, 'userAgent'), `COMUNICA:ROOM:USERS_REMOVED`, {
        key,
        userAgents,
      });

      return true;
    },
    table.room,
    _transacting
  );
}

module.exports = { removeUserAgents };
