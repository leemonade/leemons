async function newAsset(assetData, categoryId) {
  const { file, cover, ...data } = assetData;
  const formData = new FormData();

  formData.append('files', file, file.name);

  if (cover) formData.append('cover', cover, cover.name);
  if (categoryId) formData.append('categoryId', categoryId);

  Object.keys(data).forEach((key) => {
    if (data[key]) {
      formData.append(key, data[key]);
    }
  });

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
