const _ = require('lodash');
const { removeSubjectCreditsBySubjectsIds } = require('./removeSubjectCreditsBySubjectsIds');

async function removeSubjectByIds({ ids, soft, ctx }) {
  const subjects = await ctx.tx.db.Subjects.find({ id: _.isArray(ids) ? ids : [ids] }).lean();
  await ctx.tx.emit('before-remove-subjects', { subjects, soft });

  await Promise.all([
    Promise.allSettled(
      _.map(subjects, (subject) =>
        ctx.tx.call('leebrary.assets.remove', {
          id: { id: subject.image },
        })
      )
    ),
    Promise.allSettled(
      _.map(subjects, (subject) =>
        ctx.tx.call('leebrary.assets.remove', {
          id: { id: subject.icon },
        })
      )
    ),
  ]);
  await removeSubjectCreditsBySubjectsIds({ subjectIds: _.map(subjects, 'id'), soft, ctx });
  await ctx.tx.db.Subjects.deleteMany({ id: _.map(subjects, 'id') }, { soft });
  await ctx.tx.emit('after-remove-subjects', { subjects, soft });
  return true;
}

module.exports = { removeSubjectByIds };
