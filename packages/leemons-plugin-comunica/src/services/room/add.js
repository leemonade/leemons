const _ = require('lodash');
const {table} = require('../tables');
const {
  validateKeyPrefix,
  validateExistRoomKey,
} = require('../../validations/exists');
const {addUserAgents} = require("./addUserAgents");


async function add(key, {userAgents = [], useEncrypt = true, transacting: _transacting} = {}) {
  validateKeyPrefix(key, this.calledFrom);

  return global.utils.withTransaction(
    async (transacting) => {

      await validateExistRoomKey(key, {transacting});

      const room = await table.room.create({
        key,
        useEncrypt,
      }, {transacting});

      if (userAgents.length > 0) {
        await addUserAgents(room.key, userAgents, {transacting});
      }

    },
    table.room,
    _transacting
  );
}

module.exports = {add};
