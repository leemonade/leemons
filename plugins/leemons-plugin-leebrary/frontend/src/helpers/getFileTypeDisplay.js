import { capitalize } from 'lodash';

import prepareAssetType from './prepareAssetType';

function getFileTypeDisplay(file) {
  const parseFileType = prepareAssetType(file?.type, false);
  const parseExtension = file?.path.split('.').pop();

  const isFile =
    parseFileType === 'audio' ||
    parseFileType === 'video' ||
    parseFileType === 'image' ||
    parseFileType === 'document';

  const fileLabel = isFile ? parseFileType : parseExtension;

  return {
    isFile,
    fileLabel,
    displayLabel: isFile ? capitalize(fileLabel) : fileLabel.toUpperCase(),
    fileType: parseFileType,
  };
}

export default getFileTypeDisplay;
