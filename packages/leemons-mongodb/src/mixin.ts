import { LeemonsError } from '@leemons/error';
import type { Context, ServiceSchema } from '@leemons/moleculer';
import { getActionNameFromCTX } from '@leemons/service-name-parser';
import { rollbackTransaction } from '@leemons/transactions';
import _ from 'lodash';
import type { Span } from 'moleculer';
import { Query } from 'mongoose';
import { countDocuments } from './queries/countDocuments';
import { create } from './queries/create';
import { deleteMany } from './queries/deleteMany';
import { deleteOne } from './queries/deleteOne';
import { find } from './queries/find';
import { findById } from './queries/findById';
import { findByIdAndDelete } from './queries/findByIdAndDelete';
import { findByIdAndUpdate } from './queries/findByIdAndUpdate';
import { findOne } from './queries/findOne';
import { findOneAndDelete } from './queries/findOneAndDelete';
import { findOneAndUpdate } from './queries/findOneAndUpdate';
import { createTransactionIDIfNeed } from './queries/helpers/createTransactionIDIfNeed';
import { insertMany } from './queries/insertMany';
import { save } from './queries/save';
import { updateMany } from './queries/updateMany';
import { updateOne } from './queries/updateOne';
import type { Model } from './types';

interface ModelParams {
  model: any;
  modelKey: string;
  ignoreTransaction?: boolean;
  autoDeploymentID?: boolean;
  autoTransaction?: boolean;
  autoRollback?: boolean;
  autoLRN?: boolean;
  ctx: Context;
}

function tracingWrapper(f: Function, modelParams: ModelParams) {
  const { ctx } = modelParams;

  return (...params: any[]) => {
    if (!ctx?.span) {
      return f(modelParams)(...params);
    }
    const span = ctx.broker.tracer.startSpan(`mongoose ${f.name}`, {
      parentSpan: ctx.span,
      service: 'mongoose',
      type: 'mongoose',
      tags: {
        model: modelParams.model.modelName,
        action: getActionNameFromCTX(ctx),
        method: f.name,
        params,
      },
    }) as Span;

    const response = f(modelParams)(...params);

    // Check if is a mongoose query
    if (response instanceof Query) {
      // Logic to handle mongoose query object
      const oldExec = response.exec;
      response.exec = () =>
        oldExec
          .call(response)
          .then((res: any) => {
            span.finish();
            return res;
          })
          .catch((error: Error) => {
            span.setError(error);
            span.finish();
            throw error;
          });

      return response;
    }

    return response
      .then((res: any) => {
        ctx.finishSpan(span);
        return res;
      })
      .catch((error: Error) => {
        span.setError(error);
        ctx.finishSpan(span);
        throw error;
      });
  };
}

function getModelActions({
  model,
  modelKey,
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  autoLRN,
  ignoreTransaction,
  ctx,
}: ModelParams) {
  return {
    save: tracingWrapper(save, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    create: tracingWrapper(create, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    find: tracingWrapper(find, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    findById: tracingWrapper(findById, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    findOne: tracingWrapper(findOne, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    findByIdAndDelete: tracingWrapper(findByIdAndDelete, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    findByIdAndRemove: tracingWrapper(findByIdAndDelete, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    findOneAndDelete: tracingWrapper(findOneAndDelete, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    findOneAndRemove: tracingWrapper(findOneAndDelete, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    findByIdAndUpdate: tracingWrapper(findByIdAndUpdate, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    findOneAndUpdate: tracingWrapper(findOneAndUpdate, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    findOneAndReplace: () => {
      throw new Error('findOneAndReplace not implemented');
    },
    updateOne: tracingWrapper(updateOne, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    updateMany: tracingWrapper(updateMany, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    deleteOne: tracingWrapper(deleteOne, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    deleteMany: tracingWrapper(deleteMany, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    countDocuments: tracingWrapper(countDocuments, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    insertMany: tracingWrapper(insertMany, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    aggregate: model.aggregate.bind(model),
  };
}

function getDBModels({
  models,
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  autoLRN,
  ignoreTransaction,
  ctx,
}: {
  models: Record<string, Model<unknown>>;
  autoDeploymentID?: boolean;
  autoTransaction?: boolean;
  autoRollback?: boolean;
  autoLRN?: boolean;
  ignoreTransaction?: boolean;
  ctx: Context;
}) {
  return _.mapValues(models, (model, modelKey) =>
    getModelActions({
      model,
      modelKey,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ignoreTransaction,
      ctx,
    })
  );
}

function modifyCTX(
  ctx: Context,
  {
    waitToRollbackFinishOnError,
    autoDeploymentID,
    autoTransaction,
    autoRollback,
    autoLRN,
    debugTransaction,
    forceLeemonsDeploymentManagerMixinNeedToBeImported,
    models,
  }: {
    waitToRollbackFinishOnError?: boolean;
    autoDeploymentID?: boolean;
    autoTransaction?: boolean;
    autoRollback?: boolean;
    autoLRN?: boolean;
    debugTransaction?: boolean;
    forceLeemonsDeploymentManagerMixinNeedToBeImported?: boolean;
    models?: Record<string, Model<unknown>>;
  }
) {
  if (!ctx.meta.transactionID) {
    createTransactionIDIfNeed({ ctx });
  }

  if (!ctx.meta.deploymentID && autoDeploymentID) {
    throw new LeemonsError(ctx, {
      message: 'No deployment ID provided',
      httpStatusCode: 500,
    });
  }

  if (forceLeemonsDeploymentManagerMixinNeedToBeImported && !ctx.deploymentID) {
    throw new LeemonsError(ctx, {
      message: 'Leemons deployment manager mixin need to be imported',
      httpStatusCode: 500,
    });
  }

  if (autoTransaction && !ctx.tx) {
    throw new LeemonsError(ctx, {
      message: 'No transaction provided',
      httpStatusCode: 500,
    });
  }

  if (autoLRN && !ctx.lrn) {
    throw new LeemonsError(ctx, {
      message: 'No LRN provided',
      httpStatusCode: 500,
    });
  }

  if (models) {
    ctx.db = getDBModels({
      models,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }) as any;
  }

  if (debugTransaction) {
    ctx.meta.debugTransaction = true;
  }

  if (waitToRollbackFinishOnError) {
    ctx.meta.waitToRollbackFinishOnError = true;
  }

  return ctx;
}

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
  models,
}: MixinOptions = {}): Partial<ServiceSchema<Context>> => ({
  name: 'leemons-mongodb',

  hooks: {
    before: {
      '*': [
        async function (ctx: Context) {
          modifyCTX(ctx, {
            waitToRollbackFinishOnError,
            autoDeploymentID,
            autoTransaction,
            autoRollback,
            autoLRN,
            debugTransaction,
            forceLeemonsDeploymentManagerMixinNeedToBeImported,
            models,
          });
        },
      ],
    },
    error: {
      '*': [
        async function (ctx: Context, err: Error) {
          if (autoRollback && ctx.tx) {
            await rollbackTransaction(ctx);
          }
          throw err;
        },
      ],
    },
  },

  created() {
    if (models) {
      _.forIn(models, (model, modelKey) => {
        if (!model) {
          throw new Error(`Model ${modelKey} is not defined`);
        }
      });
    }
  },
});
