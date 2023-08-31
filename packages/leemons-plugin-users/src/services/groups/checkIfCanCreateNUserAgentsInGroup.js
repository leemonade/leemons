const _ = require('lodash');
const { table } = require('../tables');
const { getRolesCenters } = require('../roles/getRolesCenters');

async function checkIfCanCreateUserAgentInGroup(userAgentId, group, { transacting } = {}) {
  const userAgent = await table.userAgent.findOne(
    { id: userAgentId },
    { columns: ['role'], transacting }
  );
  const [center] = await getRolesCenters(userAgent.role, { transacting });

  const limit = await table.centerLimits.findOne({
    center,
    item: group,
    type: 'role',
  });

  if (!limit?.unlimited && limit?.limit) {
    const roles = await table.roleCenter.find(
      { center },
      {
        columns: ['role'],
        transacting,
      }
    );
    const userAgents = await table.groupUserAgent.find(
      { group },
      { columns: ['userAgent'], transacting }
    );
    const count = await table.userAgent.count(
      {
        id_$in: _.map(userAgents, 'userAgent'),
        role_$in: _.map(roles, 'role'),
        $or: [{ disabled_$null: true }, { disabled: false }],
      },
      { transacting }
    );
    if (count + 1 > limit.limit) {
      throw new Error('Cannot add the user exceeds the maximum limit.');
    }
  }

  return true;
}

async function checkIfCanCreateNUserAgentInGroupByRole(
  nUserAgents,
  group,
  role,
  { transacting } = {}
) {
  const [center] = await getRolesCenters(role, { transacting });

  const limit = await table.centerLimits.findOne({
    center,
    item: group,
    type: 'role',
  });

  if (!limit?.unlimited && limit?.limit) {
    const roles = await table.roleCenter.find(
      { center },
      {
        columns: ['role'],
        transacting,
      }
    );
    const userAgents = await table.groupUserAgent.find(
      { group },
      { columns: ['userAgent'], transacting }
    );
    const count = await table.userAgent.count(
      {
        id_$in: _.map(userAgents, 'userAgent'),
        role_$in: _.map(roles, 'role'),
        $or: [{ disabled_$null: true }, { disabled: false }],
      },
      { transacting }
    );
    if (count + nUserAgents > limit.limit) {
      throw new Error('Cannot add the user exceeds the maximum limit.');
    }
  }

  return true;
}

module.exports = { checkIfCanCreateUserAgentInGroup, checkIfCanCreateNUserAgentInGroupByRole };
