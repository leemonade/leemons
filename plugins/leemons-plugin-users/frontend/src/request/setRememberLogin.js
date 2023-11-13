async function setRememberLogin(body) {
  return leemons.api('v1/users/users/remember/login', { method: 'POST', body });
}

export default setRememberLogin;
