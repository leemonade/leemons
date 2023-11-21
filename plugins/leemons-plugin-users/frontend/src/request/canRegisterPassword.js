async function canRegisterPassword(token) {
  return leemons.api('v1/users/users/can/register-password', {
    method: 'POST',
    body: {
      token,
    },
  });
}

export default canRegisterPassword;
