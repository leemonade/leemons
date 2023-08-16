const { validateUpdateSubjectType } = require('../../validations/forms');
const { saveManagers } = require('../managers/saveManagers');

async function updateSubjectType({ data, ctx }) {
  await validateUpdateSubjectType({ data, ctx });
  const { id, managers, ..._data } = data;
  const [subjectType] = await Promise.all([
    ctx.tx.db.SubjectTypes.findOneAndUpdate({ id }, _data, { new: true }),
    saveManagers({ userAgents: managers, type: 'subject-type', relationship: id, ctx }),
  ]);
  return subjectType;
}

module.exports = { updateSubjectType };
