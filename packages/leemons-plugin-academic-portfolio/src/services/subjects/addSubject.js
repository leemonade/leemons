const { table } = require('../tables');
const { validateAddSubject } = require('../../validations/forms');
const { generateNextSubjectInternalId } = require('./generateNextSubjectInternalId');
const { addNextSubjectIndex } = require('./addNextSubjectIndex');

async function addSubject(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddSubject(data, { transacting });
      const internalId = await generateNextSubjectInternalId(data.program, {
        course: data.course,
        transacting,
      });
      await addNextSubjectIndex(data.program, {
        course: data.course,
        transacting,
      });
      return table.subjects.create({ ...data, internalId }, { transacting });
    },
    table.subjects,
    _transacting
  );
}

module.exports = { addSubject };
