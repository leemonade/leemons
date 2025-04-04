import type { Context } from "@leemons/moleculer";
import { addTransactionState } from "@leemons/transactions";
import _ from "lodash";
import type { Document, Model, SaveOptions } from "mongoose";
import { addDeploymentIDToArrayOrObject } from "./helpers/addDeploymentIDToArrayOrObject";
import { addLRNToIdToArrayOrObject } from "./helpers/addLRNToIdToArrayOrObject";
import { createTransactionIDIfNeed } from "./helpers/createTransactionIDIfNeed";
import { increaseTransactionFinishedIfNeed } from "./helpers/increaseTransactionFinishedIfNeed";
import { increaseTransactionPendingIfNeed } from "./helpers/increaseTransactionPendingIfNeed";

interface CreateParams {
  model: Model<any>;
  modelKey: string;
  autoDeploymentID?: boolean;
  autoTransaction?: boolean;
  autoRollback?: boolean;
  autoLRN?: boolean;
  ignoreTransaction?: boolean;
  ctx: Context;
}

interface LeemonsCreateOptions extends SaveOptions {
  excludeDeleted?: boolean;
  disableAutoDeploy?: boolean;
  disableAutoLRN?: boolean;
}

interface LeemonsDocument extends Document {
  id: string;
  deploymentID?: string;
  [key: string]: any;
}

export function create({
  model,
  modelKey,
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  autoLRN,
  ignoreTransaction,
  ctx,
}: CreateParams) {
  return async function <T extends LeemonsDocument>(
    toAdd: Partial<T> | Partial<T>[],
    options?: LeemonsCreateOptions
  ): Promise<T | T[]> {
    await createTransactionIDIfNeed({
      ignoreTransaction,
      autoTransaction,
      ctx,
    });
    await increaseTransactionPendingIfNeed({ ignoreTransaction, ctx });

    try {
      let toCreate = toAdd;
      if (autoDeploymentID && !options?.disableAutoDeploy) {
        toCreate = addDeploymentIDToArrayOrObject({
          items: toCreate,
          ctx,
        }) as typeof toAdd;
      }
      if (autoLRN && !options?.disableAutoLRN) {
        toCreate = addLRNToIdToArrayOrObject({
          items: toCreate,
          modelKey,
          ctx,
        }) as typeof toAdd;
      }

      const { disableAutoDeploy, disableAutoLRN, ..._options } = options || {};

      const items = (await model.create(
        toCreate,
        Object.keys(_options).length ? _options : undefined
      )) as T | T[];

      if (!ignoreTransaction && ctx.meta.transactionID) {
        await addTransactionState(ctx as any, {
          action: "leemonsMongoDBRollback",
          payload: {
            modelKey,
            action: "removeMany",
            data: _.isArray(items)
              ? _.map(items, (item) => item.id)
              : [items.id],
          },
        });
      }

      return items;
    } finally {
      await increaseTransactionFinishedIfNeed({ ignoreTransaction, ctx });
    }
  };
}
