import { LeemonsError } from "@leemons/error";
import type { Model } from "@leemons/mongodb";
import type { GetKeyValueModel } from "@leemons/mongodb-helpers";
import type {
  GetModelParams,
  GetProvidersActionsParams,
  ProvidersActions,
} from "./types";

function getModel({
  ctxKeyValueModelName,
  ctx,
}: GetModelParams): Model<GetKeyValueModel> {
  const model = ctx.tx.db[ctxKeyValueModelName];
  if (!model) {
    throw new LeemonsError(ctx, {
      message: `[leemons-providers] ctx KeyValue model not found (${ctxKeyValueModelName})`,
    });
  }
  return model;
}

export function getProvidersActions({
  ctxKeyValueModelName = "KeyValue",
}: GetProvidersActionsParams = {}): ProvidersActions {
  return {
    register: {
      handler: async (ctx) => {
        const model = getModel({ ctx, ctxKeyValueModelName });
        await model.updateOne(
          { key: "_providers_", "value.pluginName": ctx.callerPlugin },
          {
            key: "_providers_",
            value: { pluginName: ctx.callerPlugin, params: ctx.params },
          },
          { upsert: true }
        );
        return true;
      },
    },
    unregister: {
      handler: async (ctx) => {
        const model = getModel({ ctx, ctxKeyValueModelName });
        await model.deleteOne({
          key: "_providers_",
          "value.pluginName": ctx.callerPlugin,
        });
        return true;
      },
    },
  };
}
