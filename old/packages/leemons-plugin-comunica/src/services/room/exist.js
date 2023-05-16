const {table} = require('../tables');

/**
 * Check if the room key already exists
 * @public
 * @static
 * @param {string} key - key
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function exist(key, {transacting} = {}) {
  const count = await table.room.count({key}, {transacting});
  return !!count;
}

module.exports = {exist};
