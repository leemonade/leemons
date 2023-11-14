async function updateProfile(body) {
  return leemons.api('v1/users/profiles/update', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default updateProfile;
