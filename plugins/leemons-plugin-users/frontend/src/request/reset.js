async function reset(token, password) {
  return leemons.api('users/user/reset', {
    method: 'POST',
    body: {
      token,
      password,
    },
  });
}

export default reset;
