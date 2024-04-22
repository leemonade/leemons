function filterInstancesByRoleAndQuery({ instances, filters = {} }) {
  const { query, role } = filters;

  if (!query && !role) {
    return instances;
  }

  const roles = Array.isArray(role) ? role : [role];

  return instances.filter((instance) => {
    if (
      query &&
      !instance?.assignable?.asset?.name.toLocaleLowerCase().includes(query.toLocaleLowerCase())
    ) {
      return false;
    }

    return !(role && !roles.includes(instance?.assignable?.role));
  });
}
module.exports = { filterInstancesByRoleAndQuery };
