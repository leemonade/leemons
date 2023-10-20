const _ = require('lodash');
const {
  getUserPermissions,
} = require('../../permissions/instances/users/getUserPermissions/getUserPermissions.js');

async function checkPermissions({ assignationsData, ctx }) {
  const { userSession } = ctx.meta;
  const ownAssignations = {};
  const othersAssignations = [];
  const othersAssignationInstanceIds = [];
  const assignationsById = {};

  const userAgents = _.map(userSession.userAgents, 'id');
  assignationsData.forEach((assignation) => {
    if (userAgents.includes(assignation.user)) {
      ownAssignations[assignation.id] = true;
    } else {
      othersAssignations.push(assignation.id);
      othersAssignationInstanceIds.push(assignation.instance);
    }

    assignationsById[assignation.id] = assignation;
  });

  let instancePermissions = {};
  if (othersAssignationInstanceIds?.length) {
    instancePermissions = await getUserPermissions({
      instancesIds: othersAssignationInstanceIds,
      ctx,
    });
  }

  return Object.fromEntries(
    assignationsData.map((assignation) => {
      let hasPermissions = false;
      if (ownAssignations[assignation.id]) {
        hasPermissions = true;
      } else if (instancePermissions[assignation.instance].actions.includes('edit')) {
        hasPermissions = true;
      }

      return [assignation.id, hasPermissions];
    })
  );
}

module.exports = { checkPermissions };
