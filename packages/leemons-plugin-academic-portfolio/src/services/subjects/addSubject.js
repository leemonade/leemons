const { table } = require('../tables');
const { validateAddSubject } = require('../../validations/forms');
const { generateNextSubjectInternalId } = require('./generateNextSubjectInternalId');
const { addNextSubjectIndex } = require('./addNextSubjectIndex');
const { setSubjectCredits } = require('./setSubjectCredits');

async function addSubject(_data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddSubject(_data, { transacting });
      const { credits, ...data } = _data;
      const internalId = await generateNextSubjectInternalId(data.program, {
        course: data.course,
        transacting,
      });
      await addNextSubjectIndex(data.program, {
        course: data.course,
        transacting,
      });
      const subject = await table.subjects.create({ ...data, internalId }, { transacting });

      // ES: Seteamos los creditos a la asignatura para el programa en el que estamos creando la asignatura
      if (credits) await setSubjectCredits(subject.id, subject.program, credits, { transacting });

      subject.credits = credits;
      return subject;
    },
    table.subjects,
    _transacting
  );
}

module.exports = { addSubject };
