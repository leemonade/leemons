async function getUserProfiles() {
  return leemons.api('users/user/profile');
}

export default getUserProfiles;
