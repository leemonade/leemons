async function addProfile(body) {
  return leemons.api(
    {
      url: 'users/profile/add',
      allAgents: true,
    },
    {
      method: 'POST',
      body,
    }
  );
}

export default addProfile;
