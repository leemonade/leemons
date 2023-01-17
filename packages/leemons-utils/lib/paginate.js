async function paginate(
  table,
  page,
  size,
  query,
  { columns, forceColumnsOnCount = false, transacting } = {}
) {
  const _query = { ...(query ?? {}) };
  _query.$offset = page * size;
  _query.$limit = size;
  if (query?.$sort) {
    delete query.$sort;
  }

  // console.log(_query);
  const [count, items] = await Promise.all([
    table.count(query || {}, { columns: forceColumnsOnCount ? columns : undefined, transacting }),
    table.find(_query, { columns, transacting }),
  ]);

  const canGoNextPage = (page || 1) * size < count;

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

module.exports = paginate;
