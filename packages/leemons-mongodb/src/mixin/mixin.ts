import type { Context, ServiceSchema } from "@leemons/moleculer";
import { getActionNameFromCTX } from "@leemons/service-name-parser";
import { rollbackTransaction } from "@leemons/transactions";
import _ from "lodash";

import { ObjectId } from "mongodb";
import { createTransactionIDIfNeed } from "../queries/helpers/createTransactionIDIfNeed";
import type { Model } from "../types";
import { getDBModels } from "./getDBModels";
import { modifyCTX } from "./modifyCTX";

export type MixinOptions = {
  waitToRollbackFinishOnError?: boolean;
  autoDeploymentID?: boolean;
  autoTransaction?: boolean;
  autoRollback?: boolean;
  autoLRN?: boolean;
  debugTransaction?: boolean;
  forceLeemonsDeploymentManagerMixinNeedToBeImported?: boolean;
  models?: Record<string, Model<unknown>>;
};

export const mixin = ({
  waitToRollbackFinishOnError = true,
  autoDeploymentID = true,
  autoTransaction = true,
  autoRollback = true,
  autoLRN = true,
  debugTransaction = false,
  forceLeemonsDeploymentManagerMixinNeedToBeImported = true,
  models = {},
}: MixinOptions = {}): Partial<ServiceSchema<Context>> => ({
  name: "",
  metadata: {
    mixins: {
      LeemonsMongoDBMixin: true,
    },
    LeemonsMongoDBMixin: {
      models: ({
        ctx,
        ...options
      }: { ctx: Context; options: Record<string, unknown> }) =>
        getDBModels({
          ...options,
          ctx,
          models,
        }),
    },
  },
  actions: {
    leemonsMongoDBRollback: {
      async handler(ctx) {
        const model = ctx.db[ctx.params.modelKey];
        if (!model) {
          throw new Error(
            `Error on MongoDB rollback: The model "${ctx.params.modelKey}" not found in ctx.db`
          );
        }
        if (debugTransaction || process.env.DEBUG === "true") {
          console.debug(
            `[MongoDB Transactions] (Rollback) - ${ctx.params.action}`,
            ctx.params.data
          );
        }

        switch (ctx.params.action) {
          case "removeMany":
            await model.deleteMany({
              $or: [
                { id: ctx.params.data },
                {
                  _id: _.filter(ctx.params.data, (id) => ObjectId.isValid(id)),
                },
              ],
            });
            break;
          case "createMany":
            await model.create(ctx.params.data);
            break;
          case "updateMany":
            await Promise.all(
              _.map(ctx.params.data, (data) =>
                model.findOneAndUpdate({ id: data.id }, data)
              )
            );
            break;
          default:
            throw new Error(
              `Error on MongoDB rollback: The action ${ctx.params.action} not found`
            );
        }
        return true;
      },
    },
  },
  hooks: {
    error: {
      "*": [
        async function (ctx, err) {
          if (!err.message?.includes?.("LeemonsMiddlewareAuthenticated")) {
            console.error("[MongoDB Hook Error] - ", err);
          }
          if (
            autoRollback &&
            ctx.meta.transactionID &&
            ctx.id === ctx.meta.transactionExecutionId
          ) {
            if (waitToRollbackFinishOnError) {
              await rollbackTransaction(ctx);
            } else {
              rollbackTransaction(ctx);
            }
          }
          throw err;
        },
      ],
    },
    before: {
      "*": [
        async function (this: ServiceSchema<Context>, ctx) {
          modifyCTX(ctx, {
            autoDeploymentID,
            autoTransaction,
            autoRollback,
            autoLRN,
            debugTransaction,
            forceLeemonsDeploymentManagerMixinNeedToBeImported,
            models,
          });
          let createTransaction = true;
          if (ctx.action?.name) {
            const action =
              this.originalSchema.actions?.[getActionNameFromCTX(ctx)];
            if (action?.dontCreateTransactionOnCallThisFunction) {
              createTransaction = false;
            }
          }
          if (createTransaction) {
            await createTransactionIDIfNeed({ autoTransaction, ctx });
          }
        },
      ],
    },
  },
  created() {
    _.forIn(this.events, (value, key) => {
      this.events[key] = async (
        params: any,
        opts: any,
        {
          afterModifyCTX,
        }: { afterModifyCTX?: (ctx: Context) => Promise<void> } = {}
      ) =>
        value(params, opts, {
          onError: async (ctx: Context, err: Error) => {
            console.error("[MongoDB Event Error] - ", err);
            if (
              autoRollback &&
              ctx.meta.transactionID &&
              ctx.id === ctx.meta.transactionExecutionId
            ) {
              if (waitToRollbackFinishOnError) {
                await rollbackTransaction(ctx);
              } else {
                rollbackTransaction(ctx);
              }
            }
          },
          afterModifyCTX: async (ctx: Context) => {
            modifyCTX(ctx, {
              autoDeploymentID,
              autoTransaction,
              autoRollback,
              autoLRN,
              debugTransaction,
              forceLeemonsDeploymentManagerMixinNeedToBeImported,
              models,
            });
            await createTransactionIDIfNeed({ autoTransaction, ctx });
            if (_.isFunction(afterModifyCTX)) {
              await afterModifyCTX(ctx);
            }
          },
        });
      // Si forceLeemonsDeploymentManagerMixinNeedToBeImported es true estaremos llamando al evento de deployment-manager
      // y este una vez el configura el ctx llama a afterModifyCTX para que podamos configurar nuestro contexto de mongodb
      // En caso de que no sea un evento de deployment-manager no podremos acceder a ctx.db y ctx.tx en el evento
    });
  },
});
