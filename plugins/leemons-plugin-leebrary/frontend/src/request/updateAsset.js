import uploadFileAsMultipart from '@leebrary/helpers/uploadFileAsMultipart';
import { isEmpty, isNil, isString } from 'lodash';

async function updateAsset(assetData, categoryId, categoryKey) {
  const { id, file, cover, category, ...data } = assetData;
  const formData = {};

  if (categoryKey === 'media-files') {
    if (file?.id) {
      formData.file = file.id;
    } else if (isString(file) && !isEmpty(file)) {
      formData.file = file;
    } else if (!isNil(file)) {
      formData.file = await uploadFileAsMultipart(file, { name: file.name });
    }
  }

  if (cover?.id) {
    formData.cover = cover.id;
  } else if (isString(cover) && !isEmpty(cover)) {
    formData.cover = cover;
  } else if (!isNil(cover)) {
    formData.cover = await uploadFileAsMultipart(cover, { name: cover.name });
  }

  formData.categoryId = categoryId || category;

  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined && (typeof data[key] !== 'string' || data[key]?.length > 0)) {
      if (key === 'subjects') {
        formData[key] = JSON.stringify(data[key]);
      } else {
        formData[key] = data[key];
      }
    }
  });

  return leemons.api(`v1/leebrary/assets/${id}`, {
    allAgents: true,
    method: 'PUT',
    body: formData,
  });
}

export default updateAsset;
