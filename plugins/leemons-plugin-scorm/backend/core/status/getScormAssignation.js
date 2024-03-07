module.exports = async function getScormAssignation({ instance, user, ctx }) {
  const [assignation, scormStatus] = await Promise.all([
    ctx.tx.call('assignables.assignations.getAssignation', {
      assignableInstanceId: instance,
      user,
    }),
    ctx.tx.db.ScormProgress.find({
      instance,
      user,
    }).lean(),
  ]);

  return {
    assignation,
    scormStatus: scormStatus[0]?.state ?? null,
  };
};
