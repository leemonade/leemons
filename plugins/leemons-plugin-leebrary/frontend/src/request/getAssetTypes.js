async function getAssetTypes(categoryId) {
  return leemons.api(`v1/leebrary/categories/${categoryId}/types`, {
    allAgents: true,
    method: 'GET',
  });
}

export default getAssetTypes;
