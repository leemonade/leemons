const _ = require('lodash');

const { getProfiles } = require('../../settings/getProfiles');

const { getStudentProgramIds } = require('./getStudentProgramIds');

async function removeCustomPermissions({ studentId, programId, ctx }) {
  const programs = await getStudentProgramIds({ studentId, ctx });

  if (programs.length && !programs.includes(programId)) {
    await ctx.tx.call('users.permissions.removeCustomUserAgentPermission', {
      userAgentId: studentId,
      data: {
        permissionName: `academic-portfolio.program.inside.${programId}`,
      },
    });
    const { student: studentProfileId } = await getProfiles({ ctx });

    await ctx.tx.call('users.permissions.removeCustomUserAgentPermission', {
      userAgentId: studentId,
      data: {
        permissionName: `academic-portfolio.program-profile.inside.${programId}-${studentProfileId}`,
      },
    });
  }
}

module.exports = { removeCustomPermissions };
