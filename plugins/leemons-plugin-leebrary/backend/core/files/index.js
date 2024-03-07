const { exists } = require('./exists');
const { upload } = require('./upload/upload');
const { remove } = require('./remove/remove');
const { getById } = require('./getById/getById');
const { getByIds } = require('./getByIds/getByIds');
const { duplicate } = require('./duplicate');
const { getByUser } = require('./getByUser/getByUser');
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
