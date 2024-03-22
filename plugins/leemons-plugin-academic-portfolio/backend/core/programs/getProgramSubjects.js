const _ = require('lodash');

async function getProgramSubjects({ ids, options = {}, ctx }) {
  const [subjects, subCre] = await Promise.all([
    ctx.tx.db.Subjects.find({ program: _.isArray(ids) ? ids : [ids] }, '', options).lean(),
    ctx.tx.db.ProgramSubjectsCredits.find(
      { program: _.isArray(ids) ? ids : [ids] },
      '',
      options
    ).lean(),
  ]);
  const subCreBySubject = _.keyBy(subCre, 'subject');
  return _.map(subjects, (subject) => ({
    ...subject,
    credits: subCreBySubject[subject.id]?.credits || 0,
    internalId: subCreBySubject[subject.id]?.internalId || '',
    compiledInternalId: subCreBySubject[subject.id]?.compiledInternalId || '',
  }));
}

module.exports = { getProgramSubjects };
