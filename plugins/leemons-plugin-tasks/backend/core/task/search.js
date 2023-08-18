const assignablesServices = require('../assignables');

module.exports = async function searchTask({
  draft,
  preferCurrent,
  search,
  subjects,
  sort,
  userSession,
  transacting,
  ...query
} = {}) {
  const { assignables } = assignablesServices();

  try {
    return await assignables.searchAssignables(
      'task',
      { published: !draft, preferCurrent, search, subjects, sort, ...query },
      { userSession, transacting }
    );
  } catch (e) {
    throw new Error(`Failed to search tasks: ${e.message}`);
  }
};
