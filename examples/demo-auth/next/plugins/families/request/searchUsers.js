async function searchUsers(profileType, query) {
  return leemons.api(
    {
      url: 'families/search-users',
      allAgents: true,
    },
    {
      method: 'POST',
      body: {
        profileType,
        query,
      },
    }
  );
}

export default searchUsers;
