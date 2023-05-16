async function addProfile(body) {
  return leemons.api('users/profile/add', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default addProfile;
