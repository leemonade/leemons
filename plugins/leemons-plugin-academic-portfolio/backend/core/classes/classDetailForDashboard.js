const _ = require('lodash');
const { LeemonsError } = require('leemons-error');
const { classByIds } = require('./classByIds');
const { listSessionClasses } = require('./listSessionClasses');

async function classDetailForDashboard({ classId, ctx }) {
  const { userSession } = ctx.meta;

  const hasPermission = await ctx.tx.call('users.permissions.userAgentHasCustomPermission', {
    userAgentId: _.map(userSession.userAgents, 'id'),
    permissionName: `academic-portfolio.class.${classId}`,
  });
  if (!hasPermission) {
    throw new LeemonsError(ctx, { message: 'You do not have permission to view this class.' });
  }

  const [classe] = await classByIds({ ids: classId, ctx });
  const [programClasses, students, parentStudents, teachers, program] = await Promise.all([
    listSessionClasses({ program: classe.program, ctx }),
    ctx.tx.call('users.users.getUserAgentsInfo', {
      userAgentIds: classe.students,
    }),
    ctx.tx.call('users.users.getUserAgentsInfo', {
      userAgentIds: classe.parentStudents,
    }),
    ctx.tx.call('users.users.getUserAgentsInfo', {
      userAgentIds: _.map(classe.teachers, 'teacher'),
    }),
    ctx.tx.db.Programs.findOne({ id: classe.program }).select(['hideStudentsToStudents']).lean(),
  ]);

  const teachersById = _.keyBy(teachers, 'id');

  return {
    classe: {
      ...classe,
      students,
      parentStudents,
      hideStudentsToStudents: program.hideStudentsToStudents,
      teachers: _.map(classe.teachers, (teacher) => ({
        ...teacher,
        teacher: teachersById[teacher.teacher],
      })),
    },
    programClasses,
  };
}

module.exports = { classDetailForDashboard };
