import { FilterQuery, Model, PaginatedQueryResult } from '@leemons/mongodb';

type Params<M = Model<any>, R = object> = {
  model: M;
  page: number;
  size: number;
  query: FilterQuery<R>;
  columns?: string[];
  sort?: { [key: string]: import('mongoose').SortOrder };
  options?: Parameters<M['find']>[2];
};

export function mongoDBPaginate<R = any, M = Model<any>>({
  model,
  page,
  size,
  query,
  columns,
  sort,
  options = {},
}: Params<M, R>): Promise<PaginatedQueryResult<R>> {}
