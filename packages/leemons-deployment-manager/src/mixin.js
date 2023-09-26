const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { getPluginNameFromServiceName } = require('@leemons/service-name-parser');
const { getDeploymentIDFromCTX } = require('./getDeploymentIDFromCTX');
const { isCoreService } = require('./isCoreService');

async function getDeploymentID(ctx) {
  try {
    ctx.meta.deploymentID = getDeploymentIDFromCTX(ctx);
  } catch (e) {
    // Si llega un error es que no se encontrado ningun deploymentID, comprobamos la ultima opcion (el dominio)
    ctx.meta.deploymentID = await ctx.__leemonsDeploymentManagerCall(
      'deployment-manager.getDeploymentIDByDomain'
    );
    if (!ctx.meta.deploymentID) {
      throw new LeemonsError(ctx, { message: `No deploymentID found [${ctx.meta.hostname}]` });
    }
  }
}

async function modifyCTX(
  ctx,
  {
    getDeploymentIdInCall = false,
    dontGetDeploymentIDOnActionCall = ['deployment-manager.addManualDeploymentRest'],
  } = {}
) {
  // ES: Cuando un usuario llama a gateway no existe caller y el siguiente codigo peta, por eso hacemos esta comprobación
  // EN: When a user calls gateway, there is no caller and the following code crashes, so we do this check
  if (ctx.service.name !== 'gateway' || ctx.caller)
    ctx.callerPlugin = getPluginNameFromServiceName(ctx.caller);

  ctx.__leemonsDeploymentManagerCall = ctx.call;
  ctx.__leemonsDeploymentManagerEmit = ctx.emit;

  if (!getDeploymentIdInCall) {
    await getDeploymentID(ctx);
  }

  ctx.logger = console;

  ctx.prefixPN = function (string) {
    return `${getPluginNameFromServiceName(ctx.service.name)}.${string}`;
  };

  ctx.emit = async function (event, params, opts) {
    if (getDeploymentIdInCall) {
      await getDeploymentID(ctx);
    }
    return ctx.__leemonsDeploymentManagerCall(
      'deployment-manager.emit',
      {
        event: ctx.prefixPN(event),
        params,
      },
      opts
    );
  };

  ctx.call = async function (_actionName, params, opts) {
    let actionName = _actionName;
    if (_.isObject(actionName)) {
      actionName = actionName.action.name;
    }

    if (getDeploymentIdInCall && !dontGetDeploymentIDOnActionCall.includes(actionName)) {
      await getDeploymentID(ctx);
    }

    if (actionName.startsWith('deployment-manager.')) {
      return ctx.__leemonsDeploymentManagerCall(actionName, params, opts);
    }

    const manager = await ctx.__leemonsDeploymentManagerCall(
      'deployment-manager.getGoodActionToCall',
      {
        actionName,
      }
    );

    if (process.env.DEBUG === 'true')
      console.log(
        `CALL from "${ctx.action?.name || ctx.event?.name}" to "${manager.actionToCall}"`
      );

    try {
      return await ctx.__leemonsDeploymentManagerCall(manager.actionToCall, params, {
        ...opts,
        meta: {
          ...(opts?.meta || {}),
          relationshipID: manager.relationshipID,
        },
      });
    } catch (e) {
      delete ctx.meta.$statusCode;
      throw e;
    }
  };
}

module.exports = function ({
  checkIfCanCallMe = true,
  getDeploymentIdInCall = false,
  dontGetDeploymentIDOnActionCall = ['deployment-manager.addManualDeploymentRest'],
} = {}) {
  return {
    name: '',
    actions: {
      leemonsDeploymentManagerEvent: {
        async handler(ctx) {
          if (!ctx.params?.event) throw new LeemonsError(ctx, { message: 'event param required' });
          if (this.events && this.events[ctx.params.event]) {
            // Llamamos al evento el cual a sido machado por el nuestro en el created()
            console.log('Nos llaman al evento:' + ctx.params.event);
            return this.events[ctx.params.event](ctx.params.params, { parentCtx: ctx });
          }
          return null;
        },
      },
    },
    hooks: {
      before: {
        '*': [
          async function (ctx) {
            await modifyCTX(ctx, { getDeploymentIdInCall, dontGetDeploymentIDOnActionCall });

            if (checkIfCanCallMe) {
              // Si se esta intentando llamar al action leemonsDeploymentManagerEvent || leemonsMongoDBRollback lo dejamos pasar
              // sin comprobar nada, ya que intenta lanzar un evento y los eventos tienen su propia seguridad
              if (
                !ctx.action.name.includes('leemonsDeploymentManagerEvent') &&
                !ctx.action.name.includes('leemonsMongoDBRollback')
              ) {
                if (!isCoreService(ctx.caller) && !isCoreService(ctx.action.name)) {
                  if (!ctx.meta.relationshipID)
                    throw new LeemonsError(ctx, { message: 'relationshipID is required' });
                  await ctx.__leemonsDeploymentManagerCall('deployment-manager.canCallMe', {
                    fromService: ctx.caller,
                    toAction: ctx.action.name,
                    relationshipID: ctx.meta.relationshipID,
                  });
                }
              }
            }
          },
        ],
      },
    },

    created() {
      _.forIn(this.events, (value, key) => {
        const innerEvent = this._serviceSpecification.events[key];
        this.events[key] = async (params, opts, { afterModifyCTX, onError } = {}) => {
          // -- Init moleculer core code --
          let ctx;
          if (opts && opts.ctx) {
            // Reused context (in case of retry)
            ctx = opts.ctx;
          } else {
            const ep = {
              id: this.broker.nodeID,
              event: innerEvent,
            };
            ctx = this.broker.ContextFactory.create(this.broker, ep, params, opts || {});
          }
          ctx.eventName = key;
          ctx.eventType = 'emit';
          ctx.eventGroups = [innerEvent.group || this.name];

          // -- Finish moleculer core code --

          await modifyCTX(ctx, { getDeploymentIdInCall, dontGetDeploymentIDOnActionCall });

          try {
            if (_.isFunction(afterModifyCTX)) {
              await afterModifyCTX(ctx);
            }

            await ctx.__leemonsDeploymentManagerCall('deployment-manager.canCallMe', {
              fromService: getPluginNameFromServiceName(key),
              toEvent: key,
              relationshipID: ctx.meta.relationshipID,
            });

            return await innerEvent.handler(ctx).then(async (data) => {
              if (data?.err) {
                if (_.isFunction(onError)) {
                  await onError(ctx, data.err);
                }
              }
              return data;
            });
          } catch (err) {
            if (_.isFunction(onError)) {
              await onError(ctx, err);
            } else {
              throw err;
            }
          }
        };
      });
    },
  };
};
