const _ = require('lodash');
const { getUserProgramIds } = require('../../programs/getUserProgramIds');
const { getProfiles } = require('../../settings/getProfiles');

async function removeCustomPermissions({ studentId, programId, ctx }) {
  // !Solución Por lo que se le pasa a getUserProgramIds, dentro de dicha función no queremos sacar el userSession del ctx, correcto?
  const programs = await getUserProgramIds({
    ctx: {
      ...ctx,
      meta: {
        ...ctx.meta,
        userSession: {
          ...ctx.meta.userSession,
          userAgents: [{ id: studentId }],
        },
      },
    },
  });
  if (programs.length) {
    const programsIds = _.map(programs, 'id');
    if (!programsIds.includes(programId)) {
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
}

module.exports = { removeCustomPermissions };
