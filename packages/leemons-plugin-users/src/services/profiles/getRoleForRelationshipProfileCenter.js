const _ = require('lodash');
const { table } = require('../tables');

async function getRoleForRelationshipProfileCenter(profile, center, { transacting } = {}) {
  const profileRoles = await table.profileRole.find({ profile }, { transacting });
  const centerRole = await table.roleCenter.findOne(
    {
      center,
      role_$in: _.map(profileRoles, 'role'),
    },
    { transacting }
  );
  if (!centerRole)
    throw new Error(
      'Consistency error, a Role must always be associsted to a center given a Profile'
    );
  return table.roles.findOne({ id: centerRole.role }, { transacting });
}

module.exports = { getRoleForRelationshipProfileCenter };
