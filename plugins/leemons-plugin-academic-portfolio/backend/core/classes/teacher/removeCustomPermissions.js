const _ = require('lodash');
const { getUserProgramIds } = require('../../programs/getUserProgramIds');

const { getProfiles } = require('../../settings/getProfiles');

async function removeCustomPermissions({ teacherId, programId, ctx }) {
  const programs = await getUserProgramIds({ ctx });
  if (programs.length) {
    const programsIds = _.map(programs, 'id');
    if (!programsIds.includes(programId)) {
      await ctx.tx.call('users.permissions.removeCustomUserAgentPermission', {
        userAgentId: teacherId,
        data: {
          permissionName: `plugins.academic-portfolio.program.inside.${programId}`,
        },
      });
      const { teacher: teacherProfileId } = await getProfiles({ ctx });

      await ctx.tx.call('users.permissions.removeCustomUserAgentPermission', {
        userAgentId: teacherId,
        data: {
          permissionName: `plugins.academic-portfolio.program-profile.inside.${programId}-${teacherProfileId}`,
        },
      });
    }
  }
}

module.exports = { removeCustomPermissions };
