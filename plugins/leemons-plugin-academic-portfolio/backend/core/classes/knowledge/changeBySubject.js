const _ = require('lodash');

async function changeBySubject({ subjectId, knowledge, ctx }) {
  const classes = await ctx.tx.db.Class.find({ subject: subjectId }).select(['id']).lean();
  return ctx.tx.db.ClassKnowledges.updateMany({ class: _.map(classes, 'id') }, { knowledge });
}

module.exports = { changeBySubject };
