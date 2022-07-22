const _ = require('lodash');
const {table} = require('../tables');
const {
  validateKeyPrefix,
  validateExistRoomKey, validateNotExistRoomKey,
} = require('../../validations/exists');
const {addUserAgents} = require("./addUserAgents");


async function get(key, {transacting: _transacting} = {}) {
  validateKeyPrefix(key, this.calledFrom);

  return global.utils.withTransaction(
    async (transacting) => {

      await validateNotExistRoomKey(key, {transacting});

      const [room, userAgents] = await Promise.all([
        table.room.findOne({key}, {transacting}),
        table.userAgentInRoom.find({room: key}, {columns: ['userAgent'], transacting}),
      ]);

      room.userAgents = _.map(userAgents, 'userAgent');

      return room;
    },
    table.room,
    _transacting
  );
}

module.exports = {get};
