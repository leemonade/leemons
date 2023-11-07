async function registerPassword(body) {
  return leemons.api('v1/users/users/register-password', {
    method: 'POST',
    body,
  });
}

export default registerPassword;
