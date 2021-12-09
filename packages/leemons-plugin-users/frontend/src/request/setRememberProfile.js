async function setRememberProfile(id) {
  return leemons.api('users/user/remember/profile', { method: 'POST', body: { id } });
}

export default setRememberProfile;
