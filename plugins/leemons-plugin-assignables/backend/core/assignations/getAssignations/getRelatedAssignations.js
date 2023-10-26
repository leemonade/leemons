async function getRelatedAssignations({ assignationsData, ctx }) {
  const assignationsPerInstance = {};
  const assignationsById = {};

  // EN: Define the relations between assignation and instances
  // ES: Definir relaciones entre asignaciones e instancias
  assignationsData.forEach((assignation) => {
    const { id, instance } = assignation;

    assignationsById[id] = assignation;

    if (!assignationsPerInstance[instance]) {
      assignationsPerInstance[instance] = [id];
    } else {
      assignationsPerInstance[instance].push(id);
    }
  });

  // EN: Get the related-instances
  // ES: Obtener las instancias relacionadas
  const instances = Object.keys(assignationsPerInstance);

  const relatedInstances = await ctx.tx.db.Instances.find({
    id: instances,
  })
    .select(['id', 'relatedAssignableInstances'])
    .lean();

  const relatedInstancesByInstance = {};
  relatedInstances.forEach(({ id, relatedAssignableInstances }) => {
    const { before } = relatedAssignableInstances;

    relatedInstancesByInstance[id] = before;
  });

  const relatedInstancesByAssignation = {};
  const assignationsByRelation = {};
  const assignationsToSearch = [];
  Object.entries(assignationsPerInstance).forEach(([instance, instanceAssignations]) => {
    const instancesRelated = relatedInstancesByInstance[instance];

    instanceAssignations?.forEach?.((assignation) => {
      const { user } = assignationsById[assignation];
      instancesRelated.forEach(({ id: instanceId, ...props }) => {
        if (!assignationsByRelation[`instance.${instanceId}.user.${user}`]) {
          assignationsByRelation[`instance.${instanceId}.user.${user}`] = [
            { ...props, assignation },
          ];
        } else {
          assignationsByRelation[`instance.${instanceId}.user.${user}`].push({
            ...props,
            assignation,
          });
        }

        assignationsToSearch.push({ instance: instanceId, user });
      });

      relatedInstancesByAssignation[assignation] = instancesRelated;
    });
  });

  if (!assignationsToSearch.length) {
    return {};
  }

  const relatedAssignations = await ctx.tx.db.Assignations.find({
    $or: assignationsToSearch,
  })
    .select(['id', 'instance', 'user'])
    .lean();

  const relatedAssignationsByAssignation = {};

  relatedAssignations.forEach(({ instance, user, id }) => {
    const key = `instance.${instance}.user.${user}`;

    const assignationsWithRelation = assignationsByRelation[key];

    if (!assignationsWithRelation?.length) {
      return;
    }

    assignationsWithRelation.forEach(({ assignation, ...props }) => {
      if (!relatedAssignationsByAssignation[assignation]) {
        relatedAssignationsByAssignation[assignation] = [{ ...props, id }];
      } else {
        relatedAssignationsByAssignation[assignation].push({ ...props, id });
      }
    });
  });

  return relatedAssignationsByAssignation;
}

module.exports = { getRelatedAssignations };
