async function checkUserAgentDatasets() {
  return leemons.api('v1/users/users/user-agents/check-datasets', {
    allAgents: false,
    method: 'GET',
  });
}

export default checkUserAgentDatasets;
