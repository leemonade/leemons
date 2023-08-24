import { isEmpty, isNil, isString } from 'lodash';

async function updateAsset(assetData, categoryId, categoryKey) {
  const { id, file, cover, category, ...data } = assetData;
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

  if (cover?.id) {
    formData.append('cover', cover.id);
  } else if (isString(cover) && !isEmpty(cover)) {
    formData.append('cover', cover);
  } else if (!isNil(cover)) {
    formData.append('cover', cover, cover.name);
  }

  formData.append('categoryId', categoryId || category);

  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined && (typeof data[key] !== 'string' || data[key]?.length > 0)) {
      if (key === 'subjects') {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
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
