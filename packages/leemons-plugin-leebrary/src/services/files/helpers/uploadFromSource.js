const { isString } = require('lodash');
const {
  upload: uploadFile,
  uploadFromUrl: uploadFileFromUrl,
  uploadFromFileStream: uploadFileFromStream,
} = require('../upload');

async function uploadFromSource(source, { name }, { transacting }) {
  let resultFile;

  if (isString(source)) {
    resultFile = await uploadFileFromUrl(source, { name }, { transacting });
  } else if (source.readStream) {
    resultFile = await uploadFileFromStream(source, { name }, { transacting });
  } else {
    resultFile = await uploadFile(source, { name }, { transacting });
  }

  return resultFile;
}

module.exports = { uploadFromSource };
