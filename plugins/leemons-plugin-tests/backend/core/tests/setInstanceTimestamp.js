/* eslint-disable no-param-reassign */
const { table } = require('../tables');

async function setInstanceTimestamp(
  instanceId,
  timeKey,
  user,
  { userSession, transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      const { assignations: assignationsService } = leemons.getPlugin('assignables').services;

      // console.log(user, userSession.userAgents[0].id);

      const asignation = await assignationsService.getAssignation(instanceId, user, {
        userSession,
        transacting,
      });

      if (!asignation.timestamps[timeKey] && user === userSession.userAgents[0].id) {
        return assignationsService.updateAssignation(
          {
            assignableInstance: instanceId,
            user: userSession.userAgents[0].id,
            timestamps: { ...asignation.timestamps, [timeKey]: new Date() },
          },
          {
            userSession,
            transacting,
          }
        );
      }

      return asignation;
    },
    table.questionsBanks,
    _transacting
  );
}

module.exports = { setInstanceTimestamp };
