import type { Context } from "@leemons/moleculer";
import type {
  Document,
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
} from "mongoose";
import { addDeploymentIDWhereToQuery } from "./helpers/addDeploymentIDWhereToQuery";
import { excludeDeleteIfNeedToQuery } from "./helpers/excludeDeleteIfNeedToQuery";

interface FindOneParams {
  model: Model<any>;
  autoDeploymentID?: boolean;
  ctx: Context;
}

interface LeemonsFindOneOptions<T> extends QueryOptions<T> {
  excludeDeleted?: boolean;
  disableAutoDeploy?: boolean;
}

export function findOne({ model, autoDeploymentID, ctx }: FindOneParams) {
  return function <T extends Document>(
    conditions: FilterQuery<T> = {},
    projection?: ProjectionType<T>,
    options?: LeemonsFindOneOptions<T>
  ) {
    const query = excludeDeleteIfNeedToQuery(
      model.findOne(conditions, projection, options),
      options
    );
    if (autoDeploymentID && !options?.disableAutoDeploy) {
      return addDeploymentIDWhereToQuery({ query, ctx });
    }
    return query;
  };
}
