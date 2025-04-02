import type { Context } from '@leemons/moleculer';
import type { Document, FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';
import { addDeploymentIDWhereToQuery } from './helpers/addDeploymentIDWhereToQuery';
import { excludeDeleteIfNeedToQuery } from './helpers/excludeDeleteIfNeedToQuery';

interface FindParams {
  model: Model<any>;
  autoDeploymentID?: boolean;
  ctx: Context;
}

interface LeemonsFindOptions<T> extends QueryOptions<T> {
  excludeDeleted?: boolean;
  disableAutoDeploy?: boolean;
}

export function find({ model, autoDeploymentID, ctx }: FindParams) {
  return function <T extends Document>(
    conditions: FilterQuery<T> = {},
    projection?: ProjectionType<T>,
    options?: LeemonsFindOptions<T>
  ) {
    const query = excludeDeleteIfNeedToQuery(model.find(conditions, projection, options), options);
    if (autoDeploymentID) {
      return addDeploymentIDWhereToQuery({ query, ctx });
    }
    return query;
  };
}
