async function registerPassword(body) {
  return leemons.api('users/user/register-password', {
    method: 'POST',
    body,
  });
}

export default registerPassword;
