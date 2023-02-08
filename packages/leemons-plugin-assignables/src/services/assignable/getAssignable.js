const getAssignables = require('./getAssignables');

module.exports = async function getAssignable(
  id,
  { userSession, columns = ['asset'], withFiles, transacting, deleted: showDeleted = true } = {}
) {
  try {
    const assignable = await getAssignables([id], {
      columns,
      withFiles,
      deleted: showDeleted,
      userSession,
      transacting,
    });

    return assignable[0];
  } catch (e) {
    e.messasge = `The assignable ${id} does not exist or you don't have access to it.`;

    throw e;
  }
};
