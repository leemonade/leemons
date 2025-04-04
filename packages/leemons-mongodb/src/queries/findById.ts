import type { Context } from "@leemons/moleculer";
import type { Document, Model, ProjectionType, QueryOptions } from "mongoose";
import { addDeploymentIDWhereToQuery } from "./helpers/addDeploymentIDWhereToQuery";
import { excludeDeleteIfNeedToQuery } from "./helpers/excludeDeleteIfNeedToQuery";

interface FindByIdParams {
  model: Model<any>;
  autoDeploymentID?: boolean;
  ctx: Context;
}

interface LeemonsFindByIdOptions<T> extends QueryOptions<T> {
  excludeDeleted?: boolean;
  disableAutoDeploy?: boolean;
}

export function findById({ model, autoDeploymentID, ctx }: FindByIdParams) {
  return function <T extends Document>(
    id: string,
    projection?: ProjectionType<T>,
    options?: LeemonsFindByIdOptions<T>
  ) {
    const query = excludeDeleteIfNeedToQuery(
      model.findOne({ id }, projection, options),
      options
    );
    if (autoDeploymentID) {
      return addDeploymentIDWhereToQuery({ query, ctx });
    }
    return query;
  };
}
