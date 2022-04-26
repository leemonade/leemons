import { capitalize } from 'lodash';

function prepareAssetType(fileType, toCapitalize = true) {
  let type = '';

  if (fileType.indexOf('xml') > -1 || fileType.indexOf('document') > -1) {
    type = 'document';
  } else {
    [type] = fileType.split('/');
  }

  return toCapitalize ? capitalize(type) : type;
}

export { prepareAssetType };
export default prepareAssetType;
