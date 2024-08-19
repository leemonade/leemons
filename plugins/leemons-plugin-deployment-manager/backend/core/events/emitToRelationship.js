const { getActionsToCallFromRelationship } = require('./getActionsToCallFromRelationship');

/**
 * @typedef {import('@leemons/deployment-manager').Context} Context
 * @typedef {import('../auto-init/getAllPluginsAndRelations').PluginRelationship} PluginRelationship
 */

/**
 * Emit an event to a relationship
 *
 * @param {Object} params
 * @param {Context} params.ctx
 * @param {PluginRelationship} params.relationship
 * @param {string} params.event
 * @param {Object} params.params
 * @returns {Promise<void>}
 */
async function emitToRelationship({ ctx, relationship, event, params }) {
  const actions = getActionsToCallFromRelationship(relationship);

  return Promise.all(
    actions.map((action) => {
      if (process.env.DEBUG === 'true') console.log(`-- Event send to: ${action}`);
      return ctx.tx.call(
        action,
        { caller: relationship.fromPluginName, event, params },
        { meta: { relationshipID: relationship.id } }
      );
    })
  );
}

module.exports = { emitToRelationship };
