async function listProfiles(body) {
  return leemons.api(
    {
      url: 'users/profile/list',
      allAgents: true,
    },
    {
      method: 'POST',
      body,
    }
  );
}

export default listProfiles;
