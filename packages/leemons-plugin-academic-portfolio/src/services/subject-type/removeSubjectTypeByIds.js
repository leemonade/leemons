const _ = require('lodash');
const { table } = require('../tables');

async function removeSubjectTypeByIds(ids, { soft, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const subjectTypes = await table.subjectTypes.find(
        { id_$in: _.isArray(ids) ? ids : [ids] },
        { transacting }
      );
      await leemons.events.emit('before-remove-subject-types', { subjectTypes, soft, transacting });
      await table.subjectTypes.deleteMany(
        { id_$in: _.map(subjectTypes, 'id') },
        { soft, transacting }
      );
      await leemons.events.emit('after-remove-subject-types', { subjectTypes, soft, transacting });
      return true;
    },
    table.subjectTypes,
    _transacting
  );
}

module.exports = { removeSubjectTypeByIds };
