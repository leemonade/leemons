/* eslint-disable no-nested-ternary */
const _ = require('lodash');
const { table } = require('../tables');

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

async function list(page, size, { withRoles, withLimits, transacting } = {}) {
  const results = await global.utils.paginate(table.centers, page, size, undefined, {
    transacting,
  });

  if (withRoles) {
    const centerRoles = await table.roleCenter.find(
      { center_$in: _.map(results.items, 'id') },
      { transacting }
    );
    const options = { transacting };
    if (_.isObject(withRoles)) options.columns = withRoles.columns;
    const roles = await table.roles.find({ id_$in: _.map(centerRoles, 'role') }, options);
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
    let limits = await table.centerLimits.find(
      { center_$in: _.map(results.items, 'id') },
      { transacting }
    );
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
