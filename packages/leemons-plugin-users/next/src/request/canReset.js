
async function canReset(token) {
  return leemons.api('users/user/can/reset', {
    method: 'POST',
    body: {
      token,
    },
  });
}

export default canReset;
