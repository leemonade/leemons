async function listProfiles(body) {
  return leemons.api('users/profile/list', {
    method: 'POST',
    body,
  });
}

export default listProfiles;
