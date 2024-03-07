async function shareDocument({ id, canAccess, ctx }) {
  // ! No service action found in microservices code.
  // LEGACY CODE: const { assignables: assignableService } = leemons.getPlugin('assignables').services;
  await Promise.all(
    canAccess.map(({ userAgent, role }) =>
      // LEGACY CODE: assignableService.addUserToAssignable(id, [userAgent], role, { userSession, transacting })
      ctx.tx.call('assignables.assignables.addUserToAssignable', {
        id,
        userAgent: [userAgent],
        role,
      })
    )
  );
}

module.exports = shareDocument;
