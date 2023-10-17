async function updateSessionConfig(body) {
  return leemons.api('users/user/session/config', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default updateSessionConfig;
