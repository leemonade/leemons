import { generateLRN } from '@leemons/lrn';
import type { AnyContext } from '@leemons/moleculer';
import { addTransactionState } from '@leemons/transactions';
import _ from 'lodash';
import { ObjectId } from 'mongodb';
import type {
  Document,
  FilterQuery,
  Model,
  QueryOptions,
  UpdateQuery,
  UpdateWriteOpResult,
} from 'mongoose';
import { addDeploymentIDToArrayOrObject } from './helpers/addDeploymentIDToArrayOrObject';
import { createTransactionIDIfNeed } from './helpers/createTransactionIDIfNeed';
import { excludeDeleteIfNeedToQuery } from './helpers/excludeDeleteIfNeedToQuery';
import { getLRNConfig } from './helpers/getLRNConfig';
import { increaseTransactionFinishedIfNeed } from './helpers/increaseTransactionFinishedIfNeed';
import { increaseTransactionPendingIfNeed } from './helpers/increaseTransactionPendingIfNeed';

interface UpdateManyParams {
  model: Model<any>;
  modelKey: string;
  autoDeploymentID?: boolean;
  autoTransaction?: boolean;
  autoRollback?: boolean;
  autoLRN?: boolean;
  ignoreTransaction?: boolean;
  ctx: AnyContext;
}

interface LeemonsUpdateManyOptions<T> extends QueryOptions<T> {
  excludeDeleted?: boolean;
  disableAutoDeploy?: boolean;
  upsert?: boolean;
}

export function updateMany({
  model,
  modelKey,
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  autoLRN,
  ignoreTransaction,
  ctx,
}: UpdateManyParams) {
  return async function <T extends Document>(
    _conditions: FilterQuery<T> = {},
    _update: UpdateQuery<T> = {},
    options?: LeemonsUpdateManyOptions<T>
  ): Promise<UpdateWriteOpResult> {
    await createTransactionIDIfNeed({
      ignoreTransaction,
      autoTransaction,
      ctx,
    });
    await increaseTransactionPendingIfNeed({ ignoreTransaction, ctx });
    try {
      let conditions = _conditions;
      let update = _update;
      if (autoDeploymentID) {
        conditions = addDeploymentIDToArrayOrObject({ items: conditions, ctx });
        update = addDeploymentIDToArrayOrObject({ items: update, ctx });
      }
      let oldItems: T[] = [];

      if (options?.upsert) {
        if (autoLRN) {
          if (!_.isObject((update as any).$setOnInsert)) {
            (update as any).$setOnInsert = {};
          }
          (update as any).$setOnInsert.id = generateLRN({
            ...getLRNConfig({ modelKey, ctx }),
            resourceID: new ObjectId().toString(),
          });
        }
      }

      if (!ignoreTransaction && ctx.meta.transactionID) {
        oldItems = (await excludeDeleteIfNeedToQuery(
          model.find(conditions).lean(),
          options
        )) as T[];
      }

      const items = await excludeDeleteIfNeedToQuery(
        model.updateMany(conditions, update, options),
        options
      );

      if (!ignoreTransaction && ctx.meta.transactionID && oldItems?.length) {
        await addTransactionState(ctx as any, {
          action: 'leemonsMongoDBRollback',
          payload: {
            modelKey,
            action: 'updateMany',
            data: oldItems,
          },
        });
      }

      return items;
    } finally {
      await increaseTransactionFinishedIfNeed({ ignoreTransaction, ctx });
    }
  };
}
