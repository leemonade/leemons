import type { AnyContext } from '@leemons/moleculer';
import type { Document, FilterQuery, Model, QueryOptions } from 'mongoose';
import { addDeploymentIDToArrayOrObject } from './helpers/addDeploymentIDToArrayOrObject';
import { excludeDeleteIfNeedToQuery } from './helpers/excludeDeleteIfNeedToQuery';

interface CountDocumentsParams {
  model: Model<any>;
  autoDeploymentID?: boolean;
  ctx: AnyContext;
}

interface LeemonsCountDocumentsOptions<T> extends QueryOptions<T> {
  excludeDeleted?: boolean;
  disableAutoDeploy?: boolean;
}

export function countDocuments({ model, autoDeploymentID, ctx }: CountDocumentsParams) {
  return function <T extends Document>(
    _conditions: FilterQuery<T> = {},
    options?: LeemonsCountDocumentsOptions<T>
  ): Promise<number> {
    let conditions = _conditions;
    if (autoDeploymentID) {
      conditions = addDeploymentIDToArrayOrObject({ items: conditions, ctx });
    }
    return excludeDeleteIfNeedToQuery(model.countDocuments(conditions, options), options);
  };
}
