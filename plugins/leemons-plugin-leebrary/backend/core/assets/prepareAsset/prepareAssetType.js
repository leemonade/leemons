const { capitalize } = require('lodash');

function prepareAssetType(fileType, toCapitalize = true) {
  let type = '';

  if (fileType) {
    if (
      fileType.indexOf('xml') > -1 ||
      fileType.indexOf('document') > -1 ||
      fileType.indexOf('pdf') > -1
    ) {
      type = 'document';
    } else {
      [type] = fileType.split('/');
    }
  }

  return toCapitalize ? capitalize(type) : type;
}

module.exports = { prepareAssetType };
