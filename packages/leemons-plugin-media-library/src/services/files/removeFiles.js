const _ = require('lodash');
const { table } = require('../tables');
const { removeFile } = require('./removeFile');

async function removeFiles(ids, { userSession, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      if (_.isArray(ids)) {
        return Promise.all(_.map(ids, (id) => removeFile(id, { userSession, transacting })));
      }
      return removeFile(ids, { userSession, transacting });
    },
    table.files,
    _transacting
  );
}

module.exports = { removeFiles };
