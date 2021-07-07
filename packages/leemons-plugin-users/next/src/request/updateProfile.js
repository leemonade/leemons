async function updateProfile(body) {
  return leemons.api('users/profile/update', {
    method: 'POST',
    body,
  });
}

export default updateProfile;
