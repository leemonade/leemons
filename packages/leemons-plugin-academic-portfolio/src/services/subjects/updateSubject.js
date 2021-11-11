const { table } = require('../tables');
const { validateUpdateSubject } = require('../../validations/forms');
const { setSubjectCredits } = require('./setSubjectCredits');

async function updateSubject(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateUpdateSubject(data, { transacting });
      const { id, credits, ..._data } = data;
      const subject = await table.subjects.update({ id }, _data, { transacting });
      if (credits) await setSubjectCredits(subject.id, subject.program, credits, { transacting });
      return subject;
    },
    table.subjects,
    _transacting
  );
}

module.exports = { updateSubject };
