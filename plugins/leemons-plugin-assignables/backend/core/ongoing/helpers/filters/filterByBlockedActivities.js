const { uniq, keyBy, compact } = require('lodash');

module.exports = function filterByBlockedActivities({ instances, assignations, dates }) {
  const blockingInstances = compact(
    uniq(instances.flatMap((instance) => instance.relatedAssignableInstances.blocking))
  );
  const assignationsByInstance = keyBy(assignations, 'instance.id');
  const blockingActivityIsFinished = {};

  blockingInstances.forEach((instance) => {
    const assignation = assignationsByInstance[instance];
    const isFinished = !!dates.assignations[assignation.id]?.end;

    blockingActivityIsFinished[instance] = isFinished;
  });

  return instances.filter((instance) => {
    const blocking = instance.relatedAssignableInstances.blocking || [];

    return blocking.every((blockingInstance) => blockingActivityIsFinished[blockingInstance]);
  });
};
