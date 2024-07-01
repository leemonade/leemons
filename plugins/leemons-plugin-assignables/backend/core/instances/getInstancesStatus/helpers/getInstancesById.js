const { uniq } = require('lodash');

async function getInstancesById({ instances, assignations, classes, getStatusFn }) {
  const instancesById = {};

  instances.forEach((instance) => {
    const instanceData = {
      id: instance.instance,
      instance: instance.instance,
      dates: instance.dates,
      alwaysAvailable: instance.alwaysAvailable,
      moduleActivities: instance.moduleActivities,
      requiresScoring: instance.requiresScoring,
      assignations: assignations[instance.instance]?.assignations ?? [],
    };

    const subjects = instance.classes.map((classroom) => classes[classroom]?.subject?.id);
    const requiredGradesCount = uniq(subjects).length;

    instancesById[instance.instance] = {
      ...instanceData,
      status: getStatusFn(instanceData, { requiredGradesCount }),
    };
  });

  return instancesById;
}

module.exports = getInstancesById;
