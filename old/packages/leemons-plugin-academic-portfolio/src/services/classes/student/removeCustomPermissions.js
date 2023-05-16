const _ = require('lodash');
const { getUserProgramIds } = require('../../programs/getUserProgramIds');
const { getProfiles } = require('../../settings');

async function removeCustomPermissions(studentId, programId, { transacting } = {}) {
  const programs = await getUserProgramIds({ userAgents: [{ id: studentId }] });
  if (programs.length) {
    const programsIds = _.map(programs, 'id');
    if (!programsIds.includes(programId)) {
      await leemons.getPlugin('users').services.permissions.removeCustomUserAgentPermission(
        studentId,
        {
          permissionName: `plugins.academic-portfolio.program.inside.${programId}`,
        },
        { transacting }
      );
      const { student: studentProfileId } = await getProfiles({ transacting });

      await leemons.getPlugin('users').services.permissions.removeCustomUserAgentPermission(
        studentId,
        {
          permissionName: `plugins.academic-portfolio.program-profile.inside.${programId}-${studentProfileId}`,
        },
        { transacting }
      );
    }
  }
}

module.exports = { removeCustomPermissions };
