const { uploadFile } = require('./uploadFile');
const { uploadFiles } = require('./uploadFiles');
const { filesByUser } = require('./filesByUser');
const { dataForReturnFile } = require('./dataForReturnFile');
const removeFiles = require('./removeFiles');

module.exports = {
  removeFiles,
  uploadFiles,
  filesByUser,
  uploadFile,
  dataForReturnFile,
};
