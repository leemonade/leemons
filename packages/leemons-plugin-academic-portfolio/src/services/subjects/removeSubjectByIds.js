const _ = require('lodash');
const { table } = require('../tables');
const { removeSubjectCreditsBySubjectsIds } = require('./removeSubjectCreditsBySubjectsIds');

async function removeSubjectByIds(ids, { soft, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const subjects = await table.subjects.find(
        { id_$in: _.isArray(ids) ? ids : [ids] },
        { transacting }
      );
      await leemons.events.emit('before-remove-subjects', { subjects, soft, transacting });
      await removeSubjectCreditsBySubjectsIds(_.map(subjects, 'id'), { soft, transacting });
      await table.subjects.deleteMany({ id_$in: _.map(subjects, 'id') }, { soft, transacting });
      await leemons.events.emit('after-remove-subjects', { subjects, soft, transacting });
      return true;
    },
    table.subjects,
    _transacting
  );
}

module.exports = { removeSubjectByIds };
