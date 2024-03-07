async function mongoDBPaginate({ model, page, size, query, columns, sort }) {
  const queryItems = model
    .find(query || {})
    .limit(size)
    .skip(page * size);

  if (sort) {
    queryItems.sort(sort);
  }
  if (columns) {
    queryItems.select(columns);
  }
  const [count, items] = await Promise.all([
    model.countDocuments(query || {}),
    queryItems.lean().exec(),
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

module.exports = { mongoDBPaginate };
