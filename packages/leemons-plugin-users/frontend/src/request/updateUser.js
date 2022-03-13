async function updateUser(user, body) {
  return leemons.api(`users/user/${user}/update`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default updateUser;
