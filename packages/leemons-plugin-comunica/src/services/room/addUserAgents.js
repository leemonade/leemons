const _ = require('lodash');
const { table } = require('../tables');
const { validateKeyPrefix, validateNotExistRoomKey } = require('../../validations/exists');

async function add(room, userAgent, { transacting }) {
  const response = await table.userAgentInRoom.findOne(
    {
      deleted_$null: false,
      room,
      userAgent,
    },
    { transacting }
  );
  if (response) {
    // Si la existe el usuario en la sala, pero borrado se le reactiva
    if (response.deleted) {
      return table.userAgentInRoom.update(
        {
          deleted_$null: false,
          room,
          userAgent,
        },
        {
          deleted: false,
          deleted_at: null,
        },
        { transacting }
      );
    }
    return response;
  }
  // Si el usuario no esta en la sala le añadimos
  return table.userAgentInRoom.create(
    {
      room,
      userAgent,
      encryptKey: global.utils.randomString(16),
    },
    { transacting }
  );
}

async function addUserAgents(key, _userAgents, { transacting: _transacting } = {}) {
  validateKeyPrefix(key, this.calledFrom);

  const userAgents = _.isArray(_userAgents) ? _userAgents : [_userAgents];

  return global.utils.withTransaction(
    async (transacting) => {
      await validateNotExistRoomKey(key, { transacting });

      const responses = await Promise.all(
        _.map(userAgents, (userAgent) => add(key, userAgent, { transacting }))
      );

      _.forEach(responses, (response) => {
        delete response.encryptKey;
      });

      return _.isArray(_userAgents) ? responses : responses[0];
    },
    table.room,
    _transacting
  );
}

module.exports = { addUserAgents };
