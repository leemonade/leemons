async function getProfile(uri) {
  return leemons.api({
    url: 'users/profile/detail/:uri',
    query: { uri },
    allAgents: true,
  });
}

export default getProfile;
