async function reset(token, password) {
  return leemons.api('v1/users/users/reset', {
    method: 'POST',
    body: {
      token,
      password,
    },
  });
}

export default reset;
