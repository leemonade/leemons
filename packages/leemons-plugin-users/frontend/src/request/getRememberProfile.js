async function getRememberProfile(token) {
  return leemons.api('users/user/remember/profile', {
    headers: {
      Authorization: token,
    },
  });
}

export default getRememberProfile;
