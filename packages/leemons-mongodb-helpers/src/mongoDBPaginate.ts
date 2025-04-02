import type { Model, PaginatedQueryResult } from '@leemons/mongodb';
import type { FilterQuery, SortOrder } from 'mongoose';

export type MongoDBPaginateParams<M extends Model<any> = Model<any>, R = object> = {
  model: M;
  page: number;
  size: number;
  query: FilterQuery<R>;
  columns?: string[];
  sort?: { [key: string]: SortOrder };
  collation?: Parameters<M['find']>[2];
  options?: Parameters<M['find']>[2];
};

export async function mongoDBPaginate<R = unknown, M extends Model<any> = Model<any>>({
  model,
  page,
  size,
  query,
  columns,
  sort,
  collation,
  options,
}: MongoDBPaginateParams<M, R>): Promise<PaginatedQueryResult<R>> {
  const queryItems = model
    .find(query ?? {}, '', options ?? {})
    .limit(size)
    .skip(page * size);

  if (sort) {
    queryItems.sort(sort);
  }
  if (collation) {
    queryItems.collation(collation);
  }
  if (columns) {
    queryItems.select(columns);
  }
  const [count, items] = await Promise.all([
    model.countDocuments(query || {}),
    queryItems.lean().exec(),
  ]);

  const canGoNextPage = (page + 1) * size < count;

  return {
    items,
    count: items.length,
    totalCount: count,
    totalPages: Math.ceil(count / size),
    page,
    size,
    nextPage: canGoNextPage ? page + 1 : page,
    prevPage: page > 0 ? page - 1 : page,
    canGoPrevPage: page > 0,
    canGoNextPage,
  };
}

export const EMPTY_PAGINATED_RESULT: PaginatedQueryResult<never> = {
  items: [],
  page: 0,
  size: 1,
  totalPages: 0,
  totalCount: 0,
  count: 0,
  nextPage: null,
  prevPage: null,
  canGoPrevPage: false,
  canGoNextPage: false,
};
