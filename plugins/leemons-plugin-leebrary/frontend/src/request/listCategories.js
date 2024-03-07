async function listCategories() {
  const response = await leemons.api('v1/leebrary/categories/menu-list', {
    allAgents: true,
  });

  return response.categories;
}

export default listCategories;
