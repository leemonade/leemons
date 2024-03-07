function filterModuleInstancesByHavingAllActivities({ instances }) {
  return instances.filter((instance) => {
    const isModule = instance.type === 'module';

    if (!isModule) {
      return true;
    }

    const desiredActivities = instance.metadata.module.activities.length;
    const matchingActivities = instance.activities.length;

    return desiredActivities === matchingActivities;
  });
}

module.exports = { filterModuleInstancesByHavingAllActivities };
