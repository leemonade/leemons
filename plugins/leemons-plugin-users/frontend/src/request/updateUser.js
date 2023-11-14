async function updateUser(user, body) {
  return leemons.api(`v1/users/users/${user}/update`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default updateUser;
