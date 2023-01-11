const { map } = require('lodash');
const tables = require('../../../tables');
const { getInstancesData } = require('./getInstancesData');

async function getTeacherInstances({ userSession, transacting }) {
  const userAgents = userSession.userAgents.map((agent) => agent.id);

  const instancesTeached = await tables.teachers.find(
    {
      teacher_$in: userAgents,
    },
    { columns: ['assignableInstance'], transacting }
  );

  return Object.values(
    await getInstancesData(map(instancesTeached, 'assignableInstance'), { transacting })
  );
}

module.exports = { getTeacherInstances };
