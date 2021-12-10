const { uploadFiles } = require('./uploadFiles');
const { filesByUser } = require('./filesByUser');
const { dataForReturnFile } = require('./dataForReturnFile');
const { removeFiles } = require('./removeFiles');
const { removeFile } = require('./removeFile');

module.exports = {
  removeFile,
  removeFiles,
  uploadFiles,
  filesByUser,
  dataForReturnFile,
};
