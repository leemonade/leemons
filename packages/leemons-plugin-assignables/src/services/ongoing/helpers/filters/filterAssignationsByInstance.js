function filterAssignationsByInstance({ assignations, instances }) {
  const instancesMap = {};

  instances.forEach((instance) => {
    instancesMap[instance.id] = instance;
  });

  return assignations.filter((assignation) => !!instancesMap[assignation.instance.id]);
}

module.exports = { filterAssignationsByInstance };
