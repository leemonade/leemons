const _ = require('lodash');

async function getUserProgramIds({ ctx }) {
  const { userSession } = ctx.meta;
  const userAgentIds = _.map(userSession.userAgents, 'id');
  const [stClasses, thClasses] = await Promise.all([
    ctx.tx.db.ClassStudent.find({ student: userAgentIds }).lean(),
    ctx.tx.db.ClassTeacher.find({ teacher: userAgentIds }).lean(),
  ]);

  const classeIds = _.uniq(_.map(stClasses, 'class').concat(_.map(thClasses, 'class')));

  const classes = await ctx.tx.db.Class.find({ id: classeIds }).select(['program']).lean();
  return _.uniq(_.map(classes, 'program'));
}

module.exports = { getUserProgramIds };
