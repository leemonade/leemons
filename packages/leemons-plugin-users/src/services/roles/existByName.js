const _ = require('lodash');
const { table } = require('../tables');

async function existByName(name, type, center, { transacting } = {}) {
  const query = { name, type };
  if (center) {
    const rolesInCenter = await table.roleCenter.find(
      { center },
      {
        columns: ['role'],
        transacting,
      }
    );
    query.id_$in = _.map(rolesInCenter, 'role');
  }
  const response = await table.roles.count(query, { transacting });
  return !!response;
}

module.exports = existByName;
