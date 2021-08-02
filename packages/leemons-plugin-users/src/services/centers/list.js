const { table } = require('../tables');

/**
 * List of all centers in platform
 * @private
 * @static
 * @param {any=} transacting -  DB Transaction
 * @return {Promise<Center>} Created / Updated role
 * */
async function list({ transacting } = {}) {
  return table.centers.find({}, { transacting });
}

module.exports = list;
