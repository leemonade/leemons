async function getAssetTypes(categoryId) {
  return leemons.api(`leebrary/categories/${categoryId}/types`, {
    allAgents: true,
    method: 'GET',
  });
}

export default getAssetTypes;
