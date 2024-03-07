const _ = require('lodash');
const { hasActionMany } = require('./hasActionMany');

/**
 * Check if the many permission has many actions
 * @public
 * @static
 * @param {Array.<[string, Array.<string>]>} data
 * @param {any=} transacting - DB transaction
 * @return {Promise<boolean>}
 * */
async function manyPermissionsHasManyActions({ data, ctx }) {
  if (data.length === 0) return true;
  const response = await Promise.all(
    _.map(data, (d) => hasActionMany({ permissionName: d[0], actionNames: d[1], ctx }))
  );
  const result = _.uniq(response);
  return result.length > 1 ? false : result[0];
}

module.exports = { manyPermissionsHasManyActions };
