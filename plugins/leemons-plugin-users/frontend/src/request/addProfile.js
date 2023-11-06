async function addProfile(body) {
  return leemons.api('v1/users/profiles/add', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default addProfile;
