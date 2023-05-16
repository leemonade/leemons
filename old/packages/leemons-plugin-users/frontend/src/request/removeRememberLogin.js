async function removeRememberLogin() {
  return leemons.api('users/user/remember/login', { method: 'DELETE' });
}

export default removeRememberLogin;
