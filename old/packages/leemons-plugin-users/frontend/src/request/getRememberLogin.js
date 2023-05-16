async function getRememberLogin(token) {
  return leemons.api('users/user/remember/login', {
    headers: {
      Authorization: token,
    },
  });
}

export default getRememberLogin;
