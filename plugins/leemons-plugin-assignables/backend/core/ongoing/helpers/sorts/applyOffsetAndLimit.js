function applyOffsetAndLimit(result, filters) {
  const { offset, limit } = filters;

  let items = result;
  if (offset) {
    items = items.slice(offset);
  }
  if (limit) {
    items = items.slice(0, limit);
  }

  const count = result.length;

  return {
    items,
    count: items.length,
    totalCount: count,
  };
}

module.exports = { applyOffsetAndLimit };
