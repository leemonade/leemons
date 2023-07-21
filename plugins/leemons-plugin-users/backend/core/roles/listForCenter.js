const _ = require('lodash');
/**
 * List of roles for one center
 * @private
 * @static
 * @param {string} center
 * @param {any=} transacting -  DB Transaction
 * @return {Promise<Role>} Created / Updated role
 * */
async function listForCenter({ center, ctx }) {
  const centerRoles = await ctx.tx.db.RoleCenter.find({ center }).select(['id', 'role']).lean();
  return ctx.tx.db.Role.find({ id: _.map(centerRoles, 'role') }).lean();
}

module.exports = { listForCenter };
