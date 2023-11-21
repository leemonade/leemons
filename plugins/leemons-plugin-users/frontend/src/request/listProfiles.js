async function listProfiles(body) {
  return leemons.api('v1/users/profiles/list', {
    waitToFinish: true,
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default listProfiles;
