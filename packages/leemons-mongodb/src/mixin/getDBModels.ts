import type { Context } from '@leemons/moleculer';
import _ from 'lodash';
import { getModelActions } from './getModelActions';

interface GetDBModelsParams {
  models: Record<string, any>;
  autoDeploymentID?: boolean;
  autoTransaction?: boolean;
  autoRollback?: boolean;
  autoLRN?: boolean;
  ignoreTransaction?: boolean;
  ctx: Context;
}

export function getDBModels({
  models,
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  autoLRN,
  ignoreTransaction,
  ctx,
}: GetDBModelsParams) {
  const db: Record<string, any> = {};

  _.forIn(models, (model, key) => {
    db[key] = getModelActions({
      model,
      modelKey: key,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ignoreTransaction,
      ctx,
    });
  });
  return db;
}
