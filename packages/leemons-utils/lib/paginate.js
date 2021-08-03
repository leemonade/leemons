async function paginate(table, page, size, query, { transacting } = {}) {
  const _query = query || {};
  _query.$offset = page * size;
  _query.$limit = size;
  const values = await Promise.all([
    table.count(query || {}, { transacting }),
    table.find(_query, { transacting }),
  ]);
  return {
    items: values[1],
    count: values[1].length,
    totalCount: values[0],
    totalPages: values[0] / size,
    page,
    size,
    nextPage: page * size < values[0] ? page + 1 : page,
    prevPage: page > 0 ? page - 1 : page,
    canGoPrevPage: page > 0,
    canGoNextPage: page * size < values[0],
  };
}

module.exports = paginate;
