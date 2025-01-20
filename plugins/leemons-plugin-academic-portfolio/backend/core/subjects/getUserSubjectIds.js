const { SYS_PROFILE_NAMES } = require('@leemons/users');
const _ = require('lodash');

async function getUserSubjectIds({
  ctx,
  teacherTypeFilter = ['main-teacher', 'associate-teacher'],
}) {
  const profile = await ctx.tx.call('users.profiles.getProfileSysName');
  const { userSession } = ctx.meta;
  const userAgentIds = _.map(userSession.userAgents, 'id');

  if (profile === SYS_PROFILE_NAMES.TEACHER || profile === SYS_PROFILE_NAMES.STUDENT) {
    const [studentClasses, teacherClasses] = await Promise.all([
      ctx.tx.db.ClassStudent.find({ student: userAgentIds }).select(['class']).lean(),
      ctx.tx.db.ClassTeacher.find({
        teacher: userAgentIds,
        ...(teacherTypeFilter ? { type: teacherTypeFilter } : {}),
      })
        .select(['class', 'type'])
        .lean(),
    ]);

    const classeIds = _.uniq(_.map(studentClasses, 'class').concat(_.map(teacherClasses, 'class')));

    const classes = await ctx.tx.db.Class.find({ id: classeIds }).select(['subject']).lean();
    return _.uniq(_.map(classes, 'subject'));
  }

  if (profile === SYS_PROFILE_NAMES.CONTENT_DEVELOPER) {
    try {
      const developerConfig = await ctx.tx.call(
        'content-developer.developer-config.getDeveloperConfig',
        {
          developer: userSession.userAgents[0].id,
          ctx,
        }
      );

      return developerConfig?.subjects || [];
    } catch (error) {
      ctx.logger.error(error);
      return [];
    }
  }

  if (profile === SYS_PROFILE_NAMES.ADMIN) {
    const [userAgentInfo] = await ctx.tx.call('users.users.getUserAgentsInfo', {
      userAgentIds,
      withCenter: true,
      ctx,
    });

    const query = {};
    const centerPrograms = await ctx.tx.db.ProgramCenter.find({
      center: userAgentInfo?.center?.id,
    }).lean();
    query.program = centerPrograms.map((centerProgram) => centerProgram.program);

    const subjects = await ctx.tx.db.Subjects.find({ program: query.program })
      .select(['id'])
      .lean();
    return subjects.map((subject) => subject.id);
  }

  return [];
}

module.exports = { getUserSubjectIds };
