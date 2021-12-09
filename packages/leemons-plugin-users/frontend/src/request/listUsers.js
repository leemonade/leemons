async function listUsers(body) {
  return leemons.api('users/user/list', {
    method: 'POST',
    body,
  });
}

export default listUsers;
