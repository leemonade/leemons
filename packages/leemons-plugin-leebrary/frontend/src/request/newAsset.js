async function newAsset(assetData, category) {
  const formData = new FormData();

  formData.append('files', assetData.file, assetData.file.name);

  return leemons.api('leebrary/assets', {
    allAgents: true,
    method: 'POST',
    body: formData,
    headers: {
      'content-type': 'none',
    },
  });
}

export default newAsset;
