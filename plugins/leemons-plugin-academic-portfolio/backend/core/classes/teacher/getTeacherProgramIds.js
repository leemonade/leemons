const _ = require('lodash');

async function getTeacherProgramIds({ teacherId, ctx }) {
  const teacherClasses = await ctx.tx.db.ClassTeacher.find({
    teacher: teacherId,
  }).lean();

  const classIds = _.uniq(_.map(teacherClasses, 'class'));
  const classes = await ctx.tx.db.Class.find({ id: classIds }).select(['program']).lean();
  return _.uniq(_.map(classes, 'program'));
}

module.exports = { getTeacherProgramIds };
