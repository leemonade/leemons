const { LeemonsError } = require('@leemons/error');
const { getPluginNameFromServiceName } = require('@leemons/service-name-parser');
const _ = require('lodash');

const { emitToRelationship } = require('./emitToRelationship');

/**
 * @typedef {import('@leemons/deployment-manager').Context} Context
 */

/**
 * Emits an event to all registered listener plugins within the Leemons platform.
 * This function is a core part of the inter-plugin communication system, allowing
 * plugins to broadcast events that other plugins can react to.
 *
 * The function performs several security and validation checks:
 * 1. Ensures the event parameter is provided.
 * 2. Verifies that the caller is the owner of the event being emitted.
 * 3. Queries the database for plugin relationships to determine which plugins
 *    should receive the event.
 *
 * @async
 * @function emit
 * @param {Context} ctx - The context object provided by the Moleculer framework.
 *
 * @throws {LeemonsError} Throws an error if the event parameter is missing or if the caller is not the owner of the event.
 * @returns {Promise<Array>} A promise that resolves to an array of results from emitting the event to each listener plugin.
 *
 * @example
 * await emit(ctx);
 *
 * @description
 * The function follows these steps:
 * 1. Validates the presence of the event parameter.
 * 2. Extracts the plugin names from the caller and the event.
 * 3. Verifies that the caller is the owner of the event.
 * 4. Queries the database for relationships where the fromPluginName matches
 *    the caller and the events include the emitted event.
 * 5. If debug mode is enabled, logs the event emission.
 * 6. Emits the event to all listener plugins found in the relationships.
 *
 * Note: The actual emission to each plugin is handled by the `emitToRelationship` function,
 * which is called for each matching relationship.
 */
async function emit(ctx) {
  if (!ctx.params || !ctx.params?.event) {
    throw new LeemonsError(ctx, { message: 'event is required' });
  }
  // TODO [!!!] Asegurar que el caller es quien dice ser
  const fromPluginName = getPluginNameFromServiceName(ctx.caller);
  const eventPluginName = getPluginNameFromServiceName(ctx.params.event);

  if (fromPluginName !== eventPluginName) {
    throw new LeemonsError(ctx, {
      message: 'Only the owner of the plugin can trigger events on its behalf.',
    });
  }

  // Sacamos los plugins que tienen acceso a escuhar este evento desde el fromPluginName
  let relationships = await ctx.db.DeploymentPluginsRelationship.find({
    fromPluginName,
    events: ctx.params.event,
  })
    .select(['id', 'fromPluginName', 'toPluginName', 'actions'])
    .lean();

  if (process.env.DEBUG === 'true') console.log(`- Event emit: ${ctx.params.event}[${ctx.caller}]`);

  if (Array.isArray(ctx.params.targets) && ctx.params.targets.length) {
    relationships = relationships.filter((relationship) =>
      ctx.params.targets.includes(relationship.toPluginName)
    );
  }

  return Promise.all(
    relationships.map((relationship) =>
      emitToRelationship({
        ctx,
        relationship,
        event: ctx.params.event,
        params: ctx.params.params,
      })
    )
  );
}

module.exports = { emit };
