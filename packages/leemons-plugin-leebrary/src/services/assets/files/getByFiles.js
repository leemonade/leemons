const { isArray } = require('lodash');
const { tables } = require('../../tables');

async function getByFiles(fileIds, { transacting } = {}) {
  const ids = isArray(fileIds) ? fileIds : [fileIds];
  return tables.assetsFiles.find(
    {
      file_$in: ids,
    },
    { transacting }
  );
}

module.exports = { getByFiles };
