async function getProfile(uri) {
  return leemons.api({
    url: 'users/profile/detail/:uri',
    params: { uri },
  });
}

export default getProfile;
