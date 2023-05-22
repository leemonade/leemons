async function getRole(uri) {
  return leemons.api(`users/roles/detail/${uri}`, { allAgents: true });
}

export default getRole;
