const { uploadFromSource } = require('../src/services/files/helpers/uploadFromSource');
const { getByIds } = require('../src/services/files/getByIds');

module.exports = {
  upload: uploadFromSource,
  getByIds,
};
