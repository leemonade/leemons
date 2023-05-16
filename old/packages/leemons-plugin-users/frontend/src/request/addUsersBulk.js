async function addUsersBulk(body) {
  return leemons.api('users/user/create/bulk', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default addUsersBulk;
