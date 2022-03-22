// const { tables } = require('../tables');
// const { uploadFile } = require('./uploadFile');

async function uploadFiles(files, { userSession, transacting: _transacting } = {}) {
  throw new global.utils.HttpError(501, 'Method not implemented.');
  // return global.utils.withTransaction(
  //   async (transacting) => {
  //     if (_.isArray(files)) {
  //       return Promise.all(_.map(files, (file) => uploadFile(file, { userSession, transacting })));
  //     }
  //     return uploadFile(files, { userSession, transacting });
  //   },
  //   tables.files,
  //   _transacting
  // );
}

module.exports = { uploadFiles };
