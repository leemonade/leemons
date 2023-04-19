const { uniq, map } = require('lodash');
const tables = require('../../../tables');
const { getAssignablesData } = require('./getAssignablesData');

async function getInstancesData(instances, { userSession, transacting }) {
  const uniqInstances = uniq(instances);

  const instancesObj = {};
  const instancesData = await tables.assignableInstances.find(
    {
      id_$in: uniqInstances,
    },
    {
      columns: [
        'id',
        'assignable',
        'alwaysAvailable',
        'requiresScoring',
        'allowFeedback',
        'metadata',
        'created_at',
      ],
      transacting,
    }
  );

  const assignablesIds = map(instancesData, 'assignable');
  const assignablesData = await getAssignablesData(assignablesIds, { userSession, transacting });

  instancesData.forEach((instance) => {
    instancesObj[instance.id] = {
      ...instance,
      assignable: assignablesData[instance.assignable],
      metadata: JSON.parse(instance.metadata),
    };
  });

  return instancesObj;
}

module.exports = { getInstancesData };
