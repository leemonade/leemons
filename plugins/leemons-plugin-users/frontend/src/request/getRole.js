async function getRole(uri) {
  return leemons.api(`v1/users/roles/detail/${uri}`, { allAgents: true });
}

export default getRole;
