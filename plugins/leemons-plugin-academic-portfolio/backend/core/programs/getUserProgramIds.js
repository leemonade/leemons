const { SYS_PROFILE_NAMES } = require('@leemons/users');
const _ = require('lodash');

async function getUserProgramIds({ ctx, teacherTypeFilter }) {
  const { userSession } = ctx.meta;
  const userAgentIds = _.map(userSession.userAgents, 'id');

  const realProfile = await ctx.tx.call('users.profiles.getProfileSysName');
  const [userAgentInfo] = await ctx.tx.call('users.users.getUserAgentsInfo', {
    userAgentIds: ctx.meta.userSession.userAgents.map((userAgent) => userAgent.id),
    withProfile: true,
    withCenter: true,
    ctx,
  });
  const profile = userAgentInfo?.profile?.sysName;

  const userSessionCorrupted = realProfile !== profile;
  if (userSessionCorrupted && realProfile !== SYS_PROFILE_NAMES.ADMIN) {
    // Throw error ?
    ctx.logger.warn('Non admin user acting as a different user', {
      realProfile,
      profile,
    });
  }

  if (profile === SYS_PROFILE_NAMES.TEACHER || profile === SYS_PROFILE_NAMES.STUDENT) {
    const [studentClasses, teacherClasses] = await Promise.all([
      ctx.tx.db.ClassStudent.find({ student: userAgentIds }).lean(),
      ctx.tx.db.ClassTeacher.find({
        teacher: userAgentIds,
        ...(teacherTypeFilter ? { type: teacherTypeFilter } : {}),
      }).lean(),
    ]);

    const classeIds = _.uniq(_.map(studentClasses, 'class').concat(_.map(teacherClasses, 'class')));

    const classes = await ctx.tx.db.Class.find({ id: classeIds }).select(['program']).lean();
    return _.uniq(_.map(classes, 'program'));
  }

  if (profile === SYS_PROFILE_NAMES.CONTENT_DEVELOPER) {
    const developerConfig = await ctx.tx.call(
      'content-developer.developer-config.getDeveloperConfig',
      {
        developer: userSession.userAgents[0].id,
        ctx,
      }
    );

    const subjects = await ctx.tx.db.Subjects.find({ id: developerConfig.subjects })
      .select(['program'])
      .lean();
    return _.uniq(_.map(subjects, 'program'));
  }

  if (profile === SYS_PROFILE_NAMES.ADMIN) {
    const centerPrograms = await ctx.tx.db.ProgramCenter.find({
      center: userAgentInfo?.center?.id,
    })
      .select(['program'])
      .lean();

    return centerPrograms.map((centerProgram) => centerProgram.program);
  }
}

module.exports = { getUserProgramIds };
