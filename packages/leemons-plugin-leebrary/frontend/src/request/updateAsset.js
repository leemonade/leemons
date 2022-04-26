import { isEmpty, isNil, isString } from 'lodash';

async function updateAsset(assetData, categoryId, categoryKey) {
  const { id, file, coverFile, category, ...data } = assetData;
  const formData = new FormData();

  if (categoryKey === 'media-files') {
    if (file?.id) {
      formData.append('file', file.id);
    } else if (isString(file) && !isEmpty(file)) {
      formData.append('file', file);
    } else if (!isNil(file)) {
      formData.append('files', file, file.name);
    }
  }

  if (coverFile?.id) {
    formData.append('cover', coverFile.id);
  } else if (isString(coverFile) && !isEmpty(coverFile)) {
    formData.append('cover', coverFile);
  } else if (!isNil(coverFile)) {
    formData.append('cover', coverFile, coverFile.name);
  }

  formData.append('categoryId', categoryId || category);

  Object.keys(data).forEach((key) => {
    if (data[key]) {
      formData.append(key, data[key]);
    }
  });

  return leemons.api(`leebrary/assets/${id}`, {
    allAgents: true,
    method: 'PUT',
    body: formData,
    headers: {
      'content-type': 'none',
    },
  });
}

export default updateAsset;
