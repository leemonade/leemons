const _ = require('lodash');
const {table} = require('../tables');
const {
  validateKeyPrefix,
  validateNotExistRoomKey,
} = require('../../validations/exists');

async function add(room, userAgent, {transacting}) {
  const response = await table.userAgentInRoom.findOne({
    room,
    userAgent,
  }, {transacting});
  if (response) {
    return response;
  } else {
    return await table.userAgentInRoom.create({
      room,
      userAgent,
      encryptKey: global.utils.randomString(16),
    }, {transacting});
  }
}

async function addUserAgents(key, _userAgents, {transacting: _transacting} = {}) {
  validateKeyPrefix(key, this.calledFrom);

  const userAgents = _.isArray(_userAgents) ? _userAgents : [_userAgents];

  return global.utils.withTransaction(
    async (transacting) => {

      await validateNotExistRoomKey(key, {transacting});

      const responses = await Promise.all(
        _.map(userAgents, (userAgent) => add(key, userAgent, {transacting}))
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

module.exports = {addUserAgents};
