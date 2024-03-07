async function getRememberLogin(token) {
  return leemons.api('v1/users/users/remember/login', {
    headers: {
      Authorization: token,
    },
  });
}

export default getRememberLogin;
