const _ = require('lodash');
const { removeSubjectByIds } = require('./removeSubjectByIds');

async function deleteSubjectWithClasses({ id, soft = true, ctx }) {
  const subjectClasses = await ctx.tx.db.Class.find({ subject: [id] }).lean();
  // eslint-disable-next-line global-require
  const { removeClassesByIds } = require('../classes/removeClassesByIds');
  await removeClassesByIds({ ids: _.map(subjectClasses, 'id'), soft, ctx });
  await removeSubjectByIds({ ids: id, soft, ctx });
  return true;
}

module.exports = { deleteSubjectWithClasses };
