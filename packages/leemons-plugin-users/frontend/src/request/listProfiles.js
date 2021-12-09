async function listProfiles(body) {
  return leemons.api('users/profile/list', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default listProfiles;
