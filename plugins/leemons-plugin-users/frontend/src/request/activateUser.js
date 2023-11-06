async function activateUser(body) {
  return leemons.api('v1/users/users/activate-user', {
    method: 'POST',
    body,
  });
}

export default activateUser;
