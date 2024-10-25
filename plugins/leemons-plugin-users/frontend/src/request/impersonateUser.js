async function impersonateUser(userId) {
  const response = await leemons.api(`v1/users/users/impersonate/${userId}`, {
    method: 'POST',
    allAgents: true,
  });

  return response.jwtToken;
}

export default impersonateUser;
