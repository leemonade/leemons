/* eslint-disable no-nested-ternary */
const _ = require('lodash');
const { mongoDBPaginate } = require('leemons-mongodb-helpers');

/**
 * List of all centers in platform
 * @private
 * @static
 * @param {number} page - Number of page
 * @param {number} size - Number of items per page
 * @param {boolean|object} withRoles - If return center roles or not
 * @param {any=} transacting -  DB Transaction
 * @return {Promise<Center>} Created / Updated role
 * */

async function list({ page, size, withRoles, withLimits, ctx }) {
  const results = await mongoDBPaginate({ model: ctx.tx.db.Centers, page, size });

  if (withRoles) {
    const centerRoles = await ctx.tx.db.RoleCenter.find({
      center: _.map(results.items, 'id'),
    }).lean();
    const rolesQuery = ctx.tx.db.Roles.find({ id: _.map(centerRoles, 'role') }).lean();
    if (_.isObject(withRoles) && withRoles.columns) rolesQuery.select(withRoles.columns);
    const roles = await rolesQuery.exec();
    const centerRoleByCenter = _.groupBy(centerRoles, 'center');
    const rolesById = _.keyBy(roles, 'id');
    _.forEach(results.items, (center) => {
      center.roles = [];
      if (centerRoleByCenter[center.id]) {
        _.forEach(centerRoleByCenter[center.id], ({ role }) => {
          center.roles.push(rolesById[role]);
        });
      }
    });
  }

  if (withLimits) {
    let limits = await ctx.tx.db.CenterLimits.find({ center: _.map(results.items, 'id') }).lean();
    limits = _.map(limits, (limit) => ({
      ...limit,
      unlimited: limit.unlimited === 0 ? false : limit.unlimited === 1 ? true : limit.unlimited,
    }));
    const limitsByCenter = _.groupBy(limits, 'center');
    _.forEach(results.items, (center) => {
      center.limits = limitsByCenter[center.id] || [];
    });
  }

  return results;
}

module.exports = list;
