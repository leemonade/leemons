async function getDataForUserAgentDatasets() {
  return leemons.api('users/get-data-for-user-agent-datasets', {
    method: 'GET',
    allAgents: true,
  });
}

export default getDataForUserAgentDatasets;
