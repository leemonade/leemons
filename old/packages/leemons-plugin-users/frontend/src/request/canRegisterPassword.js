async function canRegisterPassword(token) {
  return leemons.api('users/user/can/register-password', {
    method: 'POST',
    body: {
      token,
    },
  });
}

export default canRegisterPassword;
