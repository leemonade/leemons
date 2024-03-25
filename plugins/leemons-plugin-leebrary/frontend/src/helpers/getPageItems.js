function getPageItems({ data = [], page = 1, size = 10, includeNewItem = false }) {
  const startRow = page * size;
  const endRow = startRow + size;
  const realCount = data.length;
  const totalCount = data.length + (includeNewItem ? 1 : 0); // Add 1 for the new item
  const totalPages = Math.ceil(realCount / size);

  // Data should come from the Server
  const items = data.slice(startRow, endRow);

  return {
    items,
    page,
    size,
    totalCount,
    totalPages,
  };
}

export { getPageItems };
export default getPageItems;
