const _ = require('lodash');
const { table } = require('../tables');
const {
  checkIfCanCreateNUserAgentsInRoleProfiles,
} = require('../users/checkIfCanCreateNUserAgentsInRoleProfiles');
const {
  checkIfCanCreateUserAgentInGroup,
} = require('../groups/checkIfCanCreateNUserAgentsInGroup');

async function active(id, { transacting } = {}) {
  // checkIfCanCreateUserAgentInGroup
  const [userAgent, groups] = await Promise.all([
    table.userAgent.findOne({ id }, { transacting }),
    table.groupUserAgent.find({ userAgent: id }, { columns: ['id'], transacting }),
  ]);
  // De todos los grupos en los que esta el usuario vamos a sacar cuales son de tipo role
  const roleGroups = await table.groups.find(
    { type: 'role', id_$in: _.map(groups, 'id') },
    { columns: ['id'], transacting }
  );

  await Promise.all([
    checkIfCanCreateNUserAgentsInRoleProfiles(1, userAgent.role, { transacting }),
    Promise.all(
      _.map(roleGroups, (group) => checkIfCanCreateUserAgentInGroup(id, group.id, { transacting }))
    ),
  ]);
  return table.userAgent.update({ id }, { disabled: false }, { transacting });
}

module.exports = {
  active,
};
