async function getProfile(uri) {
  return leemons.api({
    url: 'users/profile/detail/:uri',
    query: {
      uri,
    },
  });
}

export default getProfile;
