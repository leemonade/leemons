import { capitalize } from 'lodash';

import prepareAssetType from './prepareAssetType';

function getResourceTypeDisplay(asset) {
  const parseFileType = prepareAssetType(asset?.file?.type, false);

  const isFile =
    parseFileType === 'audio' ||
    parseFileType === 'video' ||
    parseFileType === 'image' ||
    parseFileType === 'document';

  const fileLabel = isFile ? parseFileType : asset?.extension;

  return {
    isFile,
    fileLabel,
    displayLabel: isFile ? capitalize(fileLabel) : fileLabel.toUpperCase(),
    fileType: parseFileType,
  };
}

export default getResourceTypeDisplay;
