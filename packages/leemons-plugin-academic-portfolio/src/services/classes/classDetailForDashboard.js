const _ = require('lodash');
const { classByIds } = require('./classByIds');
const { listSessionClasses } = require('./listSessionClasses');

async function classDetailForDashboard(classId, userSession, { transacting } = {}) {
  const { services: userServices } = leemons.getPlugin('users');

  const hasPermission = await userServices.permissions.userAgentHasCustomPermission(
    _.map(userSession.userAgents, 'id'),
    {
      permissionName: `plugins.academic-portfolio.class.${classId}`,
    },
    { transacting }
  );
  if (!hasPermission) {
    throw new Error('You do not have permission to view this class.');
  }

  const [classe] = await classByIds(classId, { transacting });
  const [programClasses, students, parentStudents, teachers] = await Promise.all([
    listSessionClasses(userSession, { program: classe.program }, { transacting }),
    userServices.users.getUserAgentsInfo(classe.students, { transacting }),
    userServices.users.getUserAgentsInfo(classe.parentStudents, { transacting }),
    userServices.users.getUserAgentsInfo(_.map(classe.teachers, 'teacher'), { transacting }),
  ]);

  const teachersById = _.keyBy(teachers, 'id');

  return {
    classe: {
      ...classe,
      students,
      parentStudents,
      teachers: _.map(classe.teachers, (teacher) => ({
        ...teacher,
        teacher: teachersById[teacher.teacher],
      })),
    },
    programClasses,
  };
}

module.exports = { classDetailForDashboard };
