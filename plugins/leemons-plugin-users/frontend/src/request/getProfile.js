async function getProfile(uri) {
  return leemons.api(`v1/users/profiles/detail/${uri}`, { allAgents: true });
}

export default getProfile;
