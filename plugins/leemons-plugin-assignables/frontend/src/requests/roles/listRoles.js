export default async function listRoles({ details } = {}) {
  return leemons.api(`v1/assignables/roles?details=${details ?? false}`, {
    method: 'GET',
  });
}
