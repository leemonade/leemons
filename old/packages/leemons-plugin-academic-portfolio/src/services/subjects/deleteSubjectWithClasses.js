const _ = require('lodash');
const { table } = require('../tables');
const { removeSubjectByIds } = require('./removeSubjectByIds');

async function deleteSubjectWithClasses(id, { userSession, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const subjectClasses = await table.class.find({ subject_$in: [id] }, { transacting });
      // eslint-disable-next-line global-require
      const { removeClassesByIds } = require('../classes/removeClassesByIds');
      await removeClassesByIds(_.map(subjectClasses, 'id'), {
        soft: true,
        userSession,
        transacting,
      });
      await removeSubjectByIds(id, { soft: true, userSession, transacting });
      return true;
    },
    table.subjects,
    _transacting
  );
}

module.exports = { deleteSubjectWithClasses };
