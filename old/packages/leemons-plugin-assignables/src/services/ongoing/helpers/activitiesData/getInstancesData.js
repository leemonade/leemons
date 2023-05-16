const { uniq, map } = require('lodash');
const tables = require('../../../tables');
const { getAssignablesData } = require('./getAssignablesData');

async function getInstancesData(instances, { relatedInstances = false, userSession, transacting }) {
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
        relatedInstances && 'relatedAssignableInstances',
      ].filter(Boolean),
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

    if (relatedInstances) {
      instancesObj[instance.id].relatedAssignableInstances = JSON.parse(
        instance.relatedAssignableInstances
      );
    }
  });

  return instancesObj;
}

module.exports = { getInstancesData };
