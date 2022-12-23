const _ = require('lodash');
const { table } = require('../tables');
const { validateKeyPrefix, validateNotExistRoomKey } = require('../../validations/exists');

async function removeUserAgents(key, _userAgents, { transacting: _transacting } = {}) {
  validateKeyPrefix(key, this.calledFrom);

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

      return true;
    },
    table.room,
    _transacting
  );
}

module.exports = { removeUserAgents };
