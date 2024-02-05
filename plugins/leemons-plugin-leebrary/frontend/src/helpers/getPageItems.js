function getPageItems({ data = [], page = 1, size = 10, includeNewItem = false }) {
  const startRow = page * size;
  const endRow = startRow + size;
  const totalCount = data.length + (includeNewItem ? 1 : 0); // Add 1 for the new item

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
