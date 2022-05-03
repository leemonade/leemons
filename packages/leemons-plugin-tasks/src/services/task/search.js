const assignablesServices = require('../assignables');

const { assignables } = assignablesServices;

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
