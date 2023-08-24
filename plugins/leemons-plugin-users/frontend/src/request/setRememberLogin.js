async function setRememberLogin(body) {
  return leemons.api('users/user/remember/login', { method: 'POST', body });
}

export default setRememberLogin;
