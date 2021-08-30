async function updateProfile(body) {
  return leemons.api(
    {
      url: 'users/profile/update',
      allAgents: true,
    },
    {
      method: 'POST',
      body,
    }
  );
}

export default updateProfile;
