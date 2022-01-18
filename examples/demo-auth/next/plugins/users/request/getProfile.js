async function getProfile(uri) {
  return leemons.api(`users/profile/detail/${uri}`, { allAgents: true });
}

export default getProfile;
