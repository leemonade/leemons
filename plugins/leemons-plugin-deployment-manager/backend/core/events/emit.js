const _ = require('lodash');
const { LeemonsError } = require('leemons-error');
const { getPluginNameFromServiceName } = require('leemons-service-name-parser');
const { emitToRelationship } = require('./emitToRelationship');

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
  const relationships = await ctx.db.DeploymentPluginsRelationship.find({
    fromPluginName,
    events: ctx.params.event,
  })
    .select(['id', 'fromPluginName', 'toPluginName', 'actions'])
    .lean();

  return Promise.all(
    _.map(relationships, (relationship) =>
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
