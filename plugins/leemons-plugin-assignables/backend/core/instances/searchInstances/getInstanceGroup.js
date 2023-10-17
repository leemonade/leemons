function getInstanceGroup(instance, instances) {
  if (!instance) {
    return null;
  }

  const group = [instance];

  group.push(
    ...(instance.relatedAssignableInstances?.after
      ? instance.relatedAssignableInstances.after.flatMap((relatedInstance) =>
          getInstanceGroup(instances[relatedInstance.id], instances)
        )
      : [])
  );

  return group.filter(Boolean);
}

module.exports = {
  getInstanceGroup,
};
