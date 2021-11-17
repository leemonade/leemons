const { table } = require('../tables');
const { validateAddSubject } = require('../../validations/forms');
const { setSubjectCredits } = require('./setSubjectCredits');
const { setSubjectInternalId } = require('./setSubjectInternalId');

async function addSubject(_data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddSubject(_data, { transacting });
      const { credits, internalId, ...data } = _data;

      const subject = await table.subjects.create({ ...data }, { transacting });

      // ES: Seteamos los creditos a la asignatura para el programa en el que estamos creando la asignatura
      if (credits) {
        await setSubjectCredits(subject.id, subject.program, credits, { transacting });
      }
      if (internalId) {
        await setSubjectInternalId(subject.id, subject.program, internalId, {
          course: data.course,
          transacting,
        });
      }

      return subject;
    },
    table.subjects,
    _transacting
  );
}

module.exports = { addSubject };
