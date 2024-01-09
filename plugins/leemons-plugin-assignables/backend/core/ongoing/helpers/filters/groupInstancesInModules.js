function groupInstancesInModules({ instances, modules, dates }) {
  const orphans = [];
  const activitiesPerModule = {};

  instances.forEach((instance) => {
    if (!instance.metadata?.module || instance.assignable?.role === 'learningpaths.module') {
      orphans.push(instance);
    } else if (instance.metadata?.module?.type === 'activity') {
      if (!activitiesPerModule[instance.metadata.module.id]) {
        activitiesPerModule[instance.metadata.module.id] = [];
      }
      activitiesPerModule[instance.metadata.module.id].push(instance);
    }
  });

  const groupedInstances = modules
    .map((module) => ({
      dates: dates?.instances?.[activitiesPerModule[module.id]?.[0]?.id] ?? {},
      ...module,
      type: 'module',
      activities: activitiesPerModule[module.id],
    }))
    .filter((module) => module.activities?.length);

  return [...groupedInstances, ...orphans];
}

module.exports = { groupInstancesInModules };
