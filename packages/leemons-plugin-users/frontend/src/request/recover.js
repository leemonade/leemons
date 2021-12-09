async function recover(body) {
  return leemons.api('users/user/recover', {
    method: 'POST',
    body,
  });
}

export default recover;
