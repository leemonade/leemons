/*
  === Filtering ===
*/
function filterInstancesByRoleAndQuery({ instances, filters = {} }) {
  const { query, role } = filters;

  if (!query && !role) {
    return instances;
  }

  return instances.filter(
    (instance) =>
      (query &&
        instance?.assignable?.asset?.name
          .toLocaleLowerCase()
          .includes(query.toLocaleLowerCase())) ||
      (role && instance?.assignable?.role === role)
  );
}
module.exports = { filterInstancesByRoleAndQuery };
