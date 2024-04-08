export default async function getRole({ role }) {
  return leemons.api(`v1/assignables/roles/${role}`, {
    method: 'GET',
  });
}
