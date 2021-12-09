async function login(body) {
  return leemons.api('users/user/login', {
    method: 'POST',
    body,
  });
}

export default login;
