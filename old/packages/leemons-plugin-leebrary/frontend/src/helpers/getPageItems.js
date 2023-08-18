function getPageItems({ data = [], page = 1, size = 10 }) {
  const startRow = page * size;
  const endRow = startRow + size;
  const totalCount = data.length;

  // Should comes from Server
  const items = data.slice(startRow, endRow);

  return {
    items,
    page,
    size,
    totalCount,
    totalPages: Math.ceil(totalCount / size),
  };
}

export { getPageItems };
export default getPageItems;
