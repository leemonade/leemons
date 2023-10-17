async function listCategories() {
  const response = await leemons.api('leebrary/categories/menu-list', {
    allAgents: true,
  });

  return response.categories;
}

export default listCategories;
