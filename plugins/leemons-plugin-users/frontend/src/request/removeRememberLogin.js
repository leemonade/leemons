async function removeRememberLogin() {
  return leemons.api('v1/users/users/remember/login', { method: 'DELETE' });
}

export default removeRememberLogin;
