import { getDeploymentIDFromCTX } from '@leemons/deployment-manager';
import type { AnyContext } from '@leemons/moleculer';
import type { Query } from 'mongoose';

interface AddDeploymentIDWhereParams<T> {
  query: Query<T, T>;
  ctx: AnyContext;
}

export function addDeploymentIDWhereToQuery<T>({
  query,
  ctx,
}: AddDeploymentIDWhereParams<T>): Query<T, T> {
  return query.where({ deploymentID: getDeploymentIDFromCTX(ctx) });
}
