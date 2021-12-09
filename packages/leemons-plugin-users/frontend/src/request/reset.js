async function reset(token, password) {
  return leemons.api('users/user/can/reset', {
    method: 'POST',
    body: {
      token,
      password,
    },
  });
}

export default reset;
