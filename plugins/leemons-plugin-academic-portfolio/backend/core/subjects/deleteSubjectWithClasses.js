const _ = require('lodash');
const { removeSubjectByIds } = require('./removeSubjectByIds');

async function deleteSubjectWithClasses({ id, ctx }) {
  const subjectClasses = await ctx.ts.db.Class.find({ subject: [id] }).lean();
  // eslint-disable-next-line global-require
  const { removeClassesByIds } = require('../classes/removeClassesByIds');
  await removeClassesByIds({ ids: _.map(subjectClasses, 'id'), soft: true, ctx });
  await removeSubjectByIds({ ids: id, soft: true, ctx });
  return true;
}

module.exports = { deleteSubjectWithClasses };
