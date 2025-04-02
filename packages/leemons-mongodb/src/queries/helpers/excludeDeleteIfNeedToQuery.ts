import type { Query } from 'mongoose';

interface ExcludeDeleteOptions {
  excludeDeleted?: boolean;
}

export function excludeDeleteIfNeedToQuery<T>(
  query: Query<T, T>,
  { excludeDeleted = true }: ExcludeDeleteOptions = {}
): Query<T, T> {
  if (excludeDeleted) {
    query.where({ isDeleted: false });
  }
  return query;
}
