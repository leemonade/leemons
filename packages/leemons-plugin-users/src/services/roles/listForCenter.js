const _ = require('lodash');
const { table } = require('../tables');

/**
 * List of roles for one center
 * @private
 * @static
 * @param {string} center
 * @param {any=} transacting -  DB Transaction
 * @return {Promise<Role>} Created / Updated role
 * */
async function listForCenter(center, { transacting } = {}) {
  const centerRoles = await table.roleCenter.find(
    { center },
    { columns: ['id', 'role'], transacting }
  );
  return table.role.find({ id_$in: _.map(centerRoles, 'role') }, { transacting });
}

module.exports = { listForCenter };
