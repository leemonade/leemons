const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const {
  getPluginNameFromServiceName,
  getPluginNameWithVersionIfHaveFromServiceName,
} = require('@leemons/service-name-parser');
const { getDeploymentIDFromCTX } = require('./getDeploymentIDFromCTX');
const { isCoreService } = require('./isCoreService');
const { getDeploymentID } = require('./getDeploymentID');
const { ctxCall } = require('./ctxCall');

const actionCallCache = {};
const actionCanCache = {};

async function modifyCTX(
  ctx,
  {
    getDeploymentIdInCall = false,
    dontGetDeploymentIDOnActionCall = [
      'deployment-manager.addManualDeploymentRest',
      'deployment-manager.reloadAllDeploymentsRest',
    ],
  } = {}
) {
  // ES: Cuando un usuario llama a gateway no existe caller y el siguiente codigo peta, por eso hacemos esta comprobación
  // EN: When a user calls gateway, there is no caller and the following code crashes, so we do this check
  if (ctx.service.name !== 'gateway' && ctx.caller) {
    ctx.callerPlugin = getPluginNameFromServiceName(ctx.caller);
    ctx.callerPluginV = getPluginNameWithVersionIfHaveFromServiceName(ctx.caller);
  }

  ctx.__leemonsDeploymentManagerCall = ctx.call;
  ctx.__leemonsDeploymentManagerEmit = ctx.emit;

  if (!getDeploymentIdInCall) {
    await getDeploymentID(ctx);
  }

  ctx.logger = console;

  ctx.prefixPN = function (string) {
    return `${getPluginNameFromServiceName(ctx.service.name)}${string ? '.' : ''}${string || ''}`;
  };

  ctx.prefixPNV = function (string) {
    return `${getPluginNameWithVersionIfHaveFromServiceName(ctx.service.fullName)}${
      string ? '.' : ''
    }${string || ''}`;
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
    return ctxCall(ctx, _actionName, params, opts, {
      getDeploymentIdInCall,
      dontGetDeploymentIDOnActionCall,
    });
  };
}

module.exports = function ({
  checkIfCanCallMe = true,
  getDeploymentIdInCall = false,
  dontGetDeploymentIDOnActionCall = [
    'deployment-manager.reloadAllDeploymentsRest',
    'deployment-manager.addManualDeploymentRest',
    'gateway.dropDBRest',
    'v1.client-manager.protected.newFreemiumClient',
    'v1.client-manager.protected.isSubdomainInUse',
  ],
} = {}) {
  return {
    name: '',
    actions: {
      leemonsDeploymentManagerEvent: {
        async handler(ctx) {
          if (!ctx.params?.event) throw new LeemonsError(ctx, { message: 'event param required' });
          if (this.events && this.events[ctx.params.event]) {
            // Llamamos al evento el cual a sido machado por el nuestro en el created()
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
                !ctx.action.name.includes('leemonsMongoDBRollback') &&
                !ctx.action.name.startsWith('gateway.') &&
                !ctx.callerPlugin.startsWith('gateway')
              ) {
                if (!isCoreService(ctx.caller) && !isCoreService(ctx.action.name)) {
                  if (!ctx.meta.relationshipID)
                    throw new LeemonsError(ctx, { message: 'relationshipID is required' });

                  if (!actionCanCache.hasOwnProperty(ctx.meta.deploymentID)) {
                    actionCanCache[ctx.meta.deploymentID] = [];
                  }

                  const cacheKey = ctx.caller + ctx.action.name + ctx.meta.relationshipID;
                  if (actionCanCache[ctx.meta.deploymentID].indexOf(cacheKey) === -1) {
                    let hasTransaction = false;
                    if (ctx.meta.transactionID) hasTransaction = true;
                    await ctx.__leemonsDeploymentManagerCall('deployment-manager.canCallMe', {
                      fromService: ctx.caller,
                      toAction: ctx.action.name,
                      relationshipID: ctx.meta.relationshipID,
                    });
                    if (ctx.meta.transactionID && !hasTransaction) {
                      delete ctx.meta.transactionID;
                    }
                    actionCanCache[ctx.meta.deploymentID].push(cacheKey);
                  }
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
              if (data?.err && _.isFunction(onError)) {
                await onError(ctx, data.err);
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
