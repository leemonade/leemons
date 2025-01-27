const _ = require('lodash');

const { getProfiles } = require('../../settings/getProfiles');

const { getTeacherProgramIds } = require('./getTeacherProgramIds');

async function removeCustomPermissions({ teacherId, programId, ctx }) {
  const programs = await getTeacherProgramIds({ teacherId, ctx });

  if (programs.length && !programs.includes(programId)) {
    await ctx.tx.call('users.permissions.removeCustomUserAgentPermission', {
      userAgentId: teacherId,
      data: {
        permissionName: `academic-portfolio.program.inside.${programId}`,
      },
    });
    const { teacher: teacherProfileId } = await getProfiles({ ctx });

    await ctx.tx.call('users.permissions.removeCustomUserAgentPermission', {
      userAgentId: teacherId,
      data: {
        permissionName: `academic-portfolio.program-profile.inside.${programId}-${teacherProfileId}`,
      },
    });
  }
}

module.exports = { removeCustomPermissions };
