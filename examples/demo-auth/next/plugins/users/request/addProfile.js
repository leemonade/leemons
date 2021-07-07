async function addProfile(body) {
  return leemons.api('users/profile/add', {
    method: 'POST',
    body,
  });
}

export default addProfile;
