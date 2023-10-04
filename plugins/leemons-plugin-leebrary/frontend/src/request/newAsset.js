import { isString } from 'lodash';
import uploadFileAsMultipart from '../helpers/uploadFileAsMultipart';

async function newAsset(assetData, categoryId, categoryKey) {
  const { file, cover, ...data } = assetData;
  // const formData = new FormData();
  const formData = {};

  if (categoryKey === 'media-files') {
    if (isString(file)) {
      formData.file = file;
    } else {
      const response = await uploadFileAsMultipart(file, { name: file.name });
      formData.file = response.file;
    }

    if (cover && isString(cover)) formData.cover = cover;
    if (cover && cover.name) {
      console.log('cover', cover);
      formData.cover = await uploadFileAsMultipart(cover, { name: cover.name });
    }
  }

  if (categoryKey === 'bookmarks') {
    if (cover) formData.cover == cover;
  }

  if (categoryId) formData.categoryId = categoryId;

  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined && (typeof data[key] !== 'string' || data[key]?.length > 0)) {
      if (key === 'subjects') {
        formData[key] = JSON.stringify(data[key]);
      } else {
        formData[key] = data[key];
      }
    }
  });

  return leemons.api('leebrary/assets', {
    allAgents: true,
    method: 'POST',
    body: formData,
  });
}

export default newAsset;
