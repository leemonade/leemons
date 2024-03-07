async function sharePackage({ id, canAccess, programsCanAccess, classesCanAccess, isPublic, ctx }) {
  await Promise.all(
    canAccess.map(({ userAgent, role }) =>
      ctx.tx.call('assignables.assignables.addUserToAssignable', {
        assignableId: id,
        userAgents: [userAgent],
        role,
      })
    )
  );
}

module.exports = sharePackage;
