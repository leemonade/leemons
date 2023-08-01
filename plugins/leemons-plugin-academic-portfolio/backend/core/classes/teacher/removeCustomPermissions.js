const _ = require('lodash');
const { getUserProgramIds } = require('../../programs/getUserProgramIds');
const { getProfiles } = require('../../settings');

async function removeCustomPermissions(teacherId, programId, { transacting } = {}) {
  const programs = await getUserProgramIds({ userAgents: [{ id: teacherId }] });
  if (programs.length) {
    const programsIds = _.map(programs, 'id');
    if (!programsIds.includes(programId)) {
      await leemons.getPlugin('users').services.permissions.removeCustomUserAgentPermission(
        teacherId,
        {
          permissionName: `plugins.academic-portfolio.program.inside.${programId}`,
        },
        { transacting }
      );
      const { teacher: teacherProfileId } = await getProfiles({ transacting });

      await leemons.getPlugin('users').services.permissions.removeCustomUserAgentPermission(
        teacherId,
        {
          permissionName: `plugins.academic-portfolio.program-profile.inside.${programId}-${teacherProfileId}`,
        },
        { transacting }
      );
    }
  }
}

module.exports = { removeCustomPermissions };
