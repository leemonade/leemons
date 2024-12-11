const { uniq, map } = require('lodash');

const { getAssignablesData } = require('./getAssignablesData');

async function getInstancesData({ instances, relatedInstances = false, ctx }) {
  const uniqInstances = uniq(instances);

  const instancesObj = {};
  const instancesData = await ctx.tx.db.Instances.find({
    id: uniqInstances,
  })
    .select(
      [
        'id',
        'assignable',
        'alwaysAvailable',
        'gradable',
        'requiresScoring',
        'allowFeedback',
        'metadata',
        'createdAt',
        relatedInstances && 'relatedAssignableInstances',
      ].filter(Boolean)
    )
    .lean();

  const assignablesIds = map(instancesData, 'assignable');
  const assignablesData = await getAssignablesData({ assignables: assignablesIds, ctx });

  instancesData.forEach((instance) => {
    instancesObj[instance.id] = {
      ...instance,
      assignable: assignablesData[instance.assignable],
      metadata: instance.metadata,
    };

    if (relatedInstances) {
      instancesObj[instance.id].relatedAssignableInstances = instance.relatedAssignableInstances;
    }
  });

  return instancesObj;
}

module.exports = { getInstancesData };
