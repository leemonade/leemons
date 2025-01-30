const _ = require('lodash');

async function getStudentProgramIds({ studentId, ctx }) {
  const studentClasses = await ctx.tx.db.ClassStudent.find({
    student: studentId,
  }).lean();

  const classIds = _.uniq(_.map(studentClasses, 'class'));
  const classes = await ctx.tx.db.Class.find({ id: classIds }).select(['program']).lean();
  return _.uniq(_.map(classes, 'program'));
}

module.exports = { getStudentProgramIds };
