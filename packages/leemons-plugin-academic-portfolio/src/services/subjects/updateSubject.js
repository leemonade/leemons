const { table } = require('../tables');
const { validateUpdateSubject } = require('../../validations/forms');
const { setSubjectCredits } = require('./setSubjectCredits');
const { setSubjectInternalId } = require('./setSubjectInternalId');

async function updateSubject(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      console.log(data);
      await validateUpdateSubject(data, { transacting });
      const { id, credits, internalId, ..._data } = data;
      const subject = await table.subjects.update({ id }, _data, { transacting });
      if (credits) await setSubjectCredits(subject.id, subject.program, credits, { transacting });
      if (internalId)
        await setSubjectInternalId(subject.id, subject.program, internalId, {
          course: data.course,
          transacting,
        });
      return subject;
    },
    table.subjects,
    _transacting
  );
}

module.exports = { updateSubject };
