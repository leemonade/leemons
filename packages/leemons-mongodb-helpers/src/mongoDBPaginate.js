async function mongoDBPaginate({
  model,
  page,
  size,
  query,
  columns,
  sort,
  collation,
  options = {},
}) {
  const queryItems = model
    .find(query || {}, '', options)
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

/**
 * @template T
 * @type {import("@leemons/mongodb").PaginatedQueryResult<T>}
 */
const EMPTY_PAGINATED_RESULT = {
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

module.exports = { mongoDBPaginate, EMPTY_PAGINATED_RESULT };
