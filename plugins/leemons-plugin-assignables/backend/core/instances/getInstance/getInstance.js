const { LeemonsError } = require('@leemons/error');
const { getInstances } = require('../getInstances');

/**
 * @async
 * @function getInstance
 * @param {Object} params - Parameters for getInstance
 * @param {string} params.id - The id of the instance
 * @param {Object} params.relatedAssignableInstances - Related assignable instances
 * @param {Object} params.details - Details of the instance
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<AssignablesInstance>} The instance
 * @throws {LeemonsError} When the instance does not exist or there is an error retrieving it
 */

async function getInstance({ id, relatedAssignableInstances, details, ctx }) {
  try {
    const instances = await getInstances({
      ids: [id],
      relatedAssignableInstances,
      details,
      ctx,
    });

    const [instance] = instances;
    return instance;
  } catch (e) {
    ctx.logger.error(e);
    throw new LeemonsError(ctx, { message: e.message });
  }
}

module.exports = { getInstance };
