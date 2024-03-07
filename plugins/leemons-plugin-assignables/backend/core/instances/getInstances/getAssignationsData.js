const { getAssignationsOfInstance } = require('../../assignations/getAssignationsOfInstance');

/**
 * @async
 * @function getAssignationsData
 * @param {Object} params - Parameters for getAssignationsData
 * @param {Array<string>} params.instances - The ids of the instances to get assignations data for
 * @param {Object} params.instancesTeached - Instances teached
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<AssignablesAssignation>} The assignations data per instance
 * @throws {LeemonsError} When there is an error retrieving the assignations data
 */

async function getAssignationsData({ instances, instancesTeached, ctx }) {
  const ids = instances.filter((instance) => instancesTeached[instance]);

  return getAssignationsOfInstance({
    instances: ids,
    details: true,
    ctx,
  });
}

module.exports = { getAssignationsData };
