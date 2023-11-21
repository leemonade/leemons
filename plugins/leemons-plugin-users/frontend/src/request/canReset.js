async function canReset(token) {
  return leemons.api('v1/users/users/can/reset', {
    method: 'POST',
    body: {
      token,
    },
  });
}

export default canReset;
