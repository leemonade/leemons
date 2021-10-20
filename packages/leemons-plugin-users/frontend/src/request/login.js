async function login(body) {
  console.log(body, leemons);
  return leemons.api('users/user/login', {
    method: 'POST',
    body,
  });
}

export default login;
