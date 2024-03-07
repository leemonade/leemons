const { getAssignations } = require('../getAssignations');

async function getAssignation({ assignableInstanceId, user, ctx }) {
  const assignations = await getAssignations({
    assignationsIds: [
      {
        instance: assignableInstanceId,
        user,
      },
    ],
    ctx,
  });

  return assignations[0];
}

module.exports = { getAssignation };
