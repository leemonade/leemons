async function recover(body) {
  return leemons.api('v1/users/users/recover', {
    method: 'POST',
    body,
  });
}

export default recover;
