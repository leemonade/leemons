const { exists } = require('./exists');
const { upload } = require('./upload');
const { remove } = require('./remove');
const { getById } = require('./getById');
const { getByIds } = require('./getByIds');
const { uploadFiles } = require('./uploadFiles');
const { getByUser } = require('./getByUser');
const { dataForReturnFile } = require('./dataForReturnFile');

module.exports = {
  exists,
  upload,
  remove,
  getById,
  getByIds,
  getByUser,
  uploadFiles,
  dataForReturnFile,
};
