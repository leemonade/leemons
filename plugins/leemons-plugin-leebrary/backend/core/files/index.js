const { exists } = require('./exists');
const { upload } = require('./upload');
const { remove } = require('./remove');
const { getById } = require('./getById');
const { getByIds } = require('./getByIds');
const { duplicate } = require('./duplicate');
const { getByUser } = require('./getByUser');
const { uploadFiles } = require('./uploadFiles');
const { dataForReturnFile } = require('./dataForReturnFile');

module.exports = {
  exists,
  upload,
  remove,
  getById,
  getByIds,
  duplicate,
  getByUser,
  uploadFiles,
  dataForReturnFile,
};
