const { table } = require('../tables');

/**
 * Remove one center
 * @private
 * @static
 * @param {string} id
 * @param {any=} _transacting -  DB Transaction
 * @return {Promise<Center>} Created / Updated role
 * */
async function remove(id, { soft, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await table.centers.delete(
        {
          id,
        },
        { soft, transacting }
      );
      return true;
    },
    table.centers,
    _transacting
  );
}

module.exports = remove;
