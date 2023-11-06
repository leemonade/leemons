async function updateSessionConfig(body) {
  return leemons.api('v1/users/users/session/config', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default updateSessionConfig;
