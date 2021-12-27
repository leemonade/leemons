async function updateProfile(body) {
  return leemons.api('users/profile/update', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default updateProfile;
