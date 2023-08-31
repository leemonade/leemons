const _ = require('lodash');
const { table } = require('../tables');
const {
  checkIfCanCreateNUserAgentsInRoleProfiles,
} = require('../users/checkIfCanCreateNUserAgentsInRoleProfiles');
const {
  checkIfCanCreateNUserAgentInGroupByRole,
} = require('../groups/checkIfCanCreateNUserAgentsInGroup');

async function active(id, { transacting } = {}) {
  const _ids = _.isArray(id) ? id : [id];
  // checkIfCanCreateUserAgentInGroup
  const userAgents = await table.userAgent.find({ id_$in: _ids, disabled: true }, { transacting });
  const groupsUserAgents = await table.groupUserAgent.find(
    { userAgent_$in: _.map(userAgents, 'id') },
    { columns: ['group', 'userAgent'], transacting }
  );

  // De todos los grupos en los que esta el usuario vamos a sacar cuales son de tipo role
  const roleGroups = await table.groups.find(
    { type: 'role', id_$in: _.uniq(_.map(groupsUserAgents, 'group')) },
    { columns: ['id'], transacting }
  );

  const userAgentsByRole = _.groupBy(userAgents, 'role');
  const groupsUserAgentsByGroup = _.groupBy(groupsUserAgents, 'group');

  const promises = [];

  _.forIn(userAgentsByRole, (ua, rl) => {
    promises.push(checkIfCanCreateNUserAgentsInRoleProfiles(ua.length, rl, { transacting }));
  });

  _.forEach(roleGroups, (group) => {
    // Sacamos para este grupo todos los userAgents que queremos activar
    const gua = groupsUserAgentsByGroup[group.id];
    const userAgentIds = _.map(gua, 'userAgent');
    // Sacamos los user agents y los separamos por role
    const uas = _.filter(userAgents, (ua) => userAgentIds.includes(ua.id));
    const uasRoles = _.groupBy(uas, 'role');
    // Comprobamos para el grupo para cada rol si caben
    _.forIn(uasRoles, (ua, rl) => {
      promises.push(
        checkIfCanCreateNUserAgentInGroupByRole(ua.length, group.id, rl, { transacting })
      );
    });
  });

  return table.userAgent.updateMany(
    { id_$in: _.map(userAgents, 'id') },
    { disabled: false },
    { transacting }
  );
}

module.exports = {
  active,
};
