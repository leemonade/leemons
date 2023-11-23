function groupInstancesInModules({ instances, modules }) {
  const orphans = [];
  const activitiesPerModule = {};

  instances.forEach((instance) => {
    if (!instance.metadata?.module) {
      orphans.push(instance);
    } else if (instance.metadata?.module?.type === 'activity') {
      if (!activitiesPerModule[instance.metadata.module.id]) {
        activitiesPerModule[instance.metadata.module.id] = [];
      }
      activitiesPerModule[instance.metadata.module.id].push(instance);
    }
  });

  const groupedInstances = modules.map((module) => ({
    ...module,
    type: 'module',
    activities: activitiesPerModule[module.id],
  }));

  return [...groupedInstances, ...orphans];
}

module.exports = { groupInstancesInModules };
