const { map } = require('lodash');
const tables = require('../../../tables');
const { getInstancesData } = require('./getInstancesData');

async function getStudentAssignations({ relatedInstances, userSession, transacting }) {
  const userAgents = userSession.userAgents.map((agent) => agent.id);
  const assignations = await tables.assignations.find(
    {
      user_$in: userAgents,
    },
    { columns: ['id', 'instance', 'user'], transacting }
  );

  const instancesIds = map(assignations, 'instance');

  const instancesData = await getInstancesData(instancesIds, { relatedInstances, transacting });

  return assignations.map((assignation) => ({
    ...assignation,
    instance: instancesData[assignation.instance],
  }));
}

module.exports = { getStudentAssignations };
