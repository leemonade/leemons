const _ = require('lodash');
const { table } = require('../tables');

async function removeSubjectCreditsBySubjectsIds(
  subjectIds,
  { soft, transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      const programSubjectCredits = await table.programSubjectsCredits.find(
        { subject_$in: subjectIds },
        { transacting }
      );
      await leemons.events.emit('before-remove-program-subject-credits', {
        programSubjectCredits,
        soft,
        transacting,
      });
      await table.programSubjectsCredits.deleteMany(
        { id_$in: _.map(programSubjectCredits, 'id') },
        { soft, transacting }
      );
      await leemons.events.emit('after-remove-program-subject-credits', {
        programSubjectCredits,
        soft,
        transacting,
      });
      return true;
    },
    table.subjects,
    _transacting
  );
}

module.exports = { removeSubjectCreditsBySubjectsIds };
