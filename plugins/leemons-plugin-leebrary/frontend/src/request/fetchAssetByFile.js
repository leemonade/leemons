async function fetchAssetByFile(fileId) {
  return leemons.api(`v1/leebrary/assets/by-file/${fileId}`, {
    allAgents: true,
    method: 'GET',
  });
}

export { fetchAssetByFile };
