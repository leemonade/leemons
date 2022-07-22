const _ = require('lodash');
const {table} = require('../tables');
const {
  validateKeyPrefix,
  validateNotExistRoomKey, validateNotExistUserAgentInRoomKey,
} = require('../../validations/exists');
const {addUserAgents} = require("./addUserAgents");


async function sendMessage(key, userAgent, message, {transacting: _transacting} = {}) {
  validateKeyPrefix(key, this.calledFrom);

  return global.utils.withTransaction(
    async (transacting) => {

      await validateNotExistRoomKey(key, {transacting});
      await validateNotExistUserAgentInRoomKey(key, userAgent, {transacting});


      const [room, userAgent] = await Promise.all([
        table.room.findOne({key}, {transacting}),
        table.userAgentInRoom.findOne({room: key, userAgent}, {transacting}),
      ]);

      if (room.useEncrypt) {
        message = global.utils.encrypt(message);
      }

    },
    table.room,
    _transacting
  );
}

module.exports = {add};
