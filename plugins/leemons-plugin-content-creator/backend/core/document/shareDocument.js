const { table } = require('../tables');

async function shareDocument(
  id,
  { canAccess, programsCanAccess, classesCanAccess, isPublic },
  { transacting: _transacting, userSession } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      const { assignables: assignableService } = leemons.getPlugin('assignables').services;
      await Promise.all(
        canAccess.map(({ userAgent, role }) =>
          assignableService.addUserToAssignable(id, [userAgent], role, { userSession, transacting })
        )
      );
    },

    table.documents,
    _transacting
  );
}

module.exports = shareDocument;
