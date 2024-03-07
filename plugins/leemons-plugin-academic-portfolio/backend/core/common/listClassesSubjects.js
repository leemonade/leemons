const _ = require('lodash');
const { classByIds } = require('../classes/classByIds');
const { subjectByIds } = require('../subjects/subjectByIds');

async function listClassesSubjects({ program, course, group, ctx }) {
  const query = { program };
  let ids = null;
  if (course) {
    const courseClass = await ctx.tx.db.ClassCourse.find({ course }).lean();
    ids = _.map(courseClass, 'class');
  }
  if (group) {
    const groupClass = await ctx.tx.db.ClassCourse.find({ group }).lean();
    if (_.isArray(ids)) {
      ids = ids.concat(_.map(groupClass, 'class'));
    } else {
      ids = _.map(groupClass, 'class');
    }
  }
  if (ids) query.id = ids;

  let classes = await ctx.tx.Class.find(query).select(['id']).lean();
  classes = await classByIds({ ids: _.map(classes, 'id'), ctx });

  const subjects = await subjectByIds({ ids: _.map(classes, 'subject'), ctx });

  return { classes, subjects };
}

module.exports = { listClassesSubjects };
