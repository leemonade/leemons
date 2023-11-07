async function addUsersBulk(body) {
  return leemons.api('v1/users/users/create/bulk', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default addUsersBulk;
