const { map, uniq } = require('lodash');

function filterByRole(assignablesByAssignableInstance, query) {
  if (!query.role) {
    return uniq(map(assignablesByAssignableInstance, 'assignable'));
  }

  const assignablesByAssignableInstanceWithRole = assignablesByAssignableInstance.filter(
    (assignable) => assignable.role === query.role
  );

  return uniq(map(assignablesByAssignableInstanceWithRole, 'assignable'));
}

module.exports = {
  filterByRole,
};
