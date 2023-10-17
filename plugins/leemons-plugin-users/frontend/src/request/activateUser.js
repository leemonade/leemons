async function activateUser(body) {
  return leemons.api('users/user/activate-user', {
    method: 'POST',
    body,
  });
}

export default activateUser;
