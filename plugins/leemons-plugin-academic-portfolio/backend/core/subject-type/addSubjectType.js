const { map } = require('lodash');
const { validateAddSubjectType } = require('../../validations/forms');
const { updateClassMany } = require('../classes/updateClassMany');
const { saveManagers } = require('../managers/saveManagers');

async function addSubjectType({ data: _data, ctx }) {
  await validateAddSubjectType({ data: _data, ctx });
  const { subjects, managers, ...data } = _data;
  const subjectTypeDoc = await ctx.tx.db.SubjectTypes.create(data);
  const subjectType = subjectTypeDoc.toObject();
  await saveManagers({
    userAgents: managers,
    type: 'subject-type',
    relationship: subjectType.id,
    ctx,
  });
  if (subjects?.length) {
    const classes = await ctx.tx.db.Class.find({
      subject: subjects,
      program: data.program,
    }).lean();
    await updateClassMany({
      data: {
        ids: map(classes, 'id'),
        subjectType: subjectType.id,
      },
      ctx,
    });
  }
  return subjectType;
}

module.exports = { addSubjectType };
