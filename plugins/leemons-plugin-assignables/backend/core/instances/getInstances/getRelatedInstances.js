const { map, difference } = require('lodash');

/**
 * @async
 * @function getRelatedInstances
 * @param {Object} params - Parameters for getRelatedInstances
 * @param {Array<AssignablesInstance>} params.instances - The instances to get related instances from
 * @param {boolean} params.details - If the details of the instances should be retrieved
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Object>} The related instances by id
 * @throws {LeemonsError} When there is an error retrieving the related instances
 */

async function getRelatedInstances({ instances, details, ctx }) {
  // Require inside function to avoid circular dependency
  // eslint-disable-next-line global-require
  const { getInstances } = require('./getInstances');

  const relatedInstancesIds = instances.flatMap((instance) => {
    const { before, after } = instance.relatedAssignableInstances;

    const ids = [];
    if (before?.length) {
      ids.push(...map(before, 'id'));
    }

    if (after?.length) {
      ids.push(...map(after, 'id'));
    }

    return ids;
  });

  const instancesIds = map(instances, 'id');
  const newInstancesIds = difference(relatedInstancesIds, instancesIds);

  let newInstancesData = [];

  if (newInstancesIds.length) {
    // eslint-disable-next-line no-use-before-define
    newInstancesData = await getInstances({
      ids: newInstancesIds,
      relatedAssignableInstances: false,
      details,
      ctx,
    });
  }

  const instancesByIds = {};
  instances.concat(newInstancesData).forEach((instance) => {
    instancesByIds[instance.id] = instance;
  });

  const relatedInstanceById = {};
  instances.forEach((instance) => {
    const relatedInstances = instance.relatedAssignableInstances;
    relatedInstanceById[instance.id] = {
      before: relatedInstances?.before?.map((relatedInstance) => ({
        ...relatedInstance,
        instance: instancesByIds[relatedInstance.id],
      })),
      after: relatedInstances?.after?.map((relatedInstance) => ({
        ...relatedInstance,
        instance: instancesByIds[relatedInstance.id],
      })),
    };
  });

  return relatedInstanceById;
}

module.exports = { getRelatedInstances };
