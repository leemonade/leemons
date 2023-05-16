/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');

async function deleteDocument(id, { userSession, transacting: _transacting } = {}) {
  const { assignables } = leemons.getPlugin('assignables').services;
  return global.utils.withTransaction(
    async (transacting) => {
      const { versions } = await assignables.removeAssignable(id, {
        userSession,
        transacting,
        removeAll: 1,
      });

      const documents = await table.documents.find(
        {
          assignable_$in: versions,
        },
        { transacting, columns: ['id'] }
      );
      const documentsIds = _.map(documents, 'id');

      await table.documents.deleteMany({ id_$in: documentsIds }, { userSession, transacting });

      return true;
    },
    table.documents,
    _transacting
  );
}

module.exports = deleteDocument;
