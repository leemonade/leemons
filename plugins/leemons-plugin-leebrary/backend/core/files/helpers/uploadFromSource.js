const { isString } = require('lodash');
const mime = require('mime-types');
const {
  upload: uploadFile,
  uploadFromUrl: uploadFileFromUrl,
  uploadFromFileStream: uploadFileFromStream,
  uploadImage,
} = require('../upload');

async function uploadFromSource(source, { name }, { transacting } = {}) {
  let resultFile;

  if (isString(source)) {
    resultFile = await uploadFileFromUrl(source, { name }, { transacting });
  } else if (source.readStream) {
    resultFile = await uploadFileFromStream(source, { name }, { transacting });
  } else if (source.type && source.path) {
    const contentType = source.type;
    const [fileType] = contentType.split('/');
    const extension = mime.extension(contentType);
    if (fileType === 'image' && ['jpeg', 'jpg', 'png'].includes(extension)) {
      const imageFile = await uploadImage(source.path, extension);
      resultFile = await uploadFile({ ...imageFile, type: contentType }, { name }, { transacting });
    } else {
      resultFile = await uploadFile(source, { name }, { transacting });
    }
  }

  return resultFile;
}

module.exports = { uploadFromSource };
