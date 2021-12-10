async function getRole(uri) {
  return leemons.api(`users/roles/detail/${uri}`);
}

export default getRole;
