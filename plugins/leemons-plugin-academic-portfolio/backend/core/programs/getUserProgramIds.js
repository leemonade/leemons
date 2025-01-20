const { SYS_PROFILE_NAMES } = require('@leemons/users');
const _ = require('lodash');

async function getUserProgramIds({ ctx, teacherTypeFilter }) {
  const profile = await ctx.tx.call('users.profiles.getProfileSysName');
  const { userSession } = ctx.meta;
  const userAgentIds = _.map(userSession.userAgents, 'id');

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
}

module.exports = { getUserProgramIds };
