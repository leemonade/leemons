import { LeemonsError } from "@leemons/error";
import type { Context, ServiceSchema } from "@leemons/moleculer";
import {
  getPluginNameFromServiceName,
  getPluginNameWithVersionIfHaveFromServiceName,
} from "@leemons/service-name-parser";
import _ from "lodash";
import type { Endpoint, GenericObject } from "moleculer";
import { ACTION_CALLS_EXCLUDED_ON_DEPLOYMENT_CHECK } from "./contants";
import { ctxCall } from "./ctxCall";
import { getDeploymentID } from "./getDeploymentID";

const actionCanCache: Record<string, string[]> = {};

const CONTROLLED_HTTP_STATUS_CODE = [307];

async function modifyCTX(
  ctx: Context,
  {
    getDeploymentIdInCall = false,
    dontGetDeploymentIDOnActionCall = [
      ...ACTION_CALLS_EXCLUDED_ON_DEPLOYMENT_CHECK,
    ],
  } = {}
): Promise<void> {
  // ES: Cuando un usuario llama a gateway no existe caller y el siguiente codigo peta, por eso hacemos esta comprobación
  // EN: When a user calls gateway, there is no caller and the following code crashes, so we do this check
  if (ctx.service?.name !== "gateway" && ctx.caller) {
    ctx.callerPlugin = getPluginNameFromServiceName(ctx.caller);
    ctx.callerPluginV = getPluginNameWithVersionIfHaveFromServiceName(
      ctx.caller
    );
  }

  ctx.__leemonsDeploymentManagerCall = ctx.call;
  ctx.__leemonsDeploymentManagerEmit = ctx.emit;

  if (!getDeploymentIdInCall) {
    await getDeploymentID(ctx);
  }

  ctx.logger = {
    ...console,
    fatal: console.error, // Add missing fatal method
    debug: (...params: any[]) => {
      if (process.env.DEBUG === "true") {
        console.debug(...params);
      }
    },
  };

  ctx.prefixPN = function (string?: string): string {
    return `${getPluginNameFromServiceName(ctx.service.name)}${string ? "." : ""}${string || ""}`;
  };

  ctx.prefixPNV = function (string?: string): string {
    return `${getPluginNameWithVersionIfHaveFromServiceName(ctx.service.fullName)}${
      string ? "." : ""
    }${string || ""}`;
  };

  ctx.emit = async function (
    event: string,
    params?: any,
    opts?: any
  ): Promise<any> {
    if (getDeploymentIdInCall) {
      await getDeploymentID(ctx);
    }
    return ctx.__leemonsDeploymentManagerCall(
      "deployment-manager.emit",
      {
        event: ctx.prefixPN(event),
        params,
      },
      opts
    );
  };

  ctx.call = async function (
    _actionName: string,
    params?: any,
    opts?: any
  ): Promise<any> {
    return ctxCall(ctx, _actionName, params, opts, {
      getDeploymentIdInCall,
      dontGetDeploymentIDOnActionCall,
    });
  };
}

interface EventHandlerOptions {
  afterModifyCTX?: (ctx: Context) => Promise<void>;
  onError?: (ctx: Context, err: any) => Promise<void>;
}

export function LeemonsDeploymentManagerMixin({
  checkIfCanCallMe = true,
  getDeploymentIdInCall = false,
  dontGetDeploymentIDOnActionCall = [
    ...ACTION_CALLS_EXCLUDED_ON_DEPLOYMENT_CHECK,
  ],
} = {}): ServiceSchema<Context> {
  return {
    name: "",
    actions: {
      leemonsDeploymentManagerEvent: {
        async handler(ctx: Context) {
          if (!ctx.params?.event) {
            throw new LeemonsError(ctx, { message: "event param required" });
          }
          if (this.events && this.events[ctx.params.event]) {
            // Llamamos al evento el cual a sido machado por el nuestro en el created()
            return this.events[ctx.params.event](ctx.params.params, {
              parentCtx: ctx,
            });
          }
          return null;
        },
      },
    },
    hooks: {
      after: {
        "*": function afterHook(ctx: Context, res: any) {
          if (
            ctx.meta.$statusCode === undefined ||
            !CONTROLLED_HTTP_STATUS_CODE.includes(ctx.meta.$statusCode)
          ) {
            ctx.meta.$statusCode = 200;
          }
          return res;
        } as any,
      },
      before: {
        "*": [
          async function beforeHook(ctx: Context): Promise<void> {
            await modifyCTX(ctx, {
              getDeploymentIdInCall,
              dontGetDeploymentIDOnActionCall,
            });

            // Si se esta intentando llamar al action leemonsDeploymentManagerEvent || leemonsMongoDBRollback lo dejamos pasar
            // sin comprobar nada, ya que intenta lanzar un evento y los eventos tienen su propia seguridad
            if (
              checkIfCanCallMe &&
              ctx.action?.name &&
              !ctx.action.name.includes("leemonsDeploymentManagerEvent") &&
              !ctx.action.name.includes("leemonsMongoDBRollback") &&
              !ctx.action.name.startsWith("gateway.") &&
              !ctx.callerPlugin.startsWith("gateway")
            ) {
              if (!ctx.meta.relationshipID) {
                throw new LeemonsError(ctx, {
                  message: "relationshipID is required",
                });
              }

              if (
                !Object.prototype.hasOwnProperty.call(
                  actionCanCache,
                  ctx.meta.deploymentID
                )
              ) {
                actionCanCache[ctx.meta.deploymentID] = [];
              }

              const cacheKey =
                ctx.caller + ctx.action.name + ctx.meta.relationshipID;
              if (!actionCanCache[ctx.meta.deploymentID].includes(cacheKey)) {
                const hasTransaction = Boolean(ctx.meta.transactionID);
                await ctx.__leemonsDeploymentManagerCall(
                  "deployment-manager.canCallMe",
                  {
                    fromService: ctx.caller,
                    toAction: ctx.action.name,
                    relationshipID: ctx.meta.relationshipID,
                  }
                );
                if (ctx.meta.transactionID && !hasTransaction) {
                  delete ctx.meta.transactionID;
                }
                actionCanCache[ctx.meta.deploymentID].push(cacheKey);
              }
            }
          },
        ],
      },
    },

    created() {
      _.forIn(this.events, (value, key) => {
        const innerEvent = this._serviceSpecification.events[key];
        this.events[key] = async (
          params: any,
          opts: any,
          { afterModifyCTX, onError }: EventHandlerOptions = {}
        ) => {
          // -- Init moleculer core code --
          let ctx;
          if (opts && opts.ctx) {
            // Reused context (in case of retry)
            ctx = opts.ctx;
          } else {
            const ep: Endpoint & { event: string } = {
              id: this.broker.nodeID,
              event: innerEvent,
              broker: this.broker,
              node: this.broker.nodeID,
              local: true,
              state: true,
            };
            ctx = this.broker.ContextFactory.create(
              this.broker,
              ep,
              params,
              opts || {}
            ) as Context;
          }
          ctx.eventName = key;
          ctx.eventType = "emit";
          ctx.eventGroups = [innerEvent.group || this.name];
          ctx.locals = {} as GenericObject;

          // -- Finish moleculer core code --

          await modifyCTX(ctx, {
            getDeploymentIdInCall,
            dontGetDeploymentIDOnActionCall,
          });

          try {
            if (_.isFunction(afterModifyCTX)) {
              await afterModifyCTX(ctx);
            }

            await ctx.__leemonsDeploymentManagerCall(
              "deployment-manager.canCallMe",
              {
                fromService: getPluginNameFromServiceName(key),
                toEvent: key,
                relationshipID: ctx.meta.relationshipID,
              }
            );

            return await innerEvent.handler(ctx).then(async (data: any) => {
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
}
