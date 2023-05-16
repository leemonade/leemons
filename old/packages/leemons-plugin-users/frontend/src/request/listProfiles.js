async function listProfiles(body) {
  return leemons.api('users/profile/list', {
    waitToFinish: true,
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default listProfiles;
