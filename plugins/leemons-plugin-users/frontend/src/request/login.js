async function login(body) {
  return leemons.api('v1/users/users/login', {
    method: 'POST',
    body,
  });
}

export default login;
