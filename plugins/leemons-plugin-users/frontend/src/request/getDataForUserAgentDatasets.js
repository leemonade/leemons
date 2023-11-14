async function getDataForUserAgentDatasets() {
  return leemons.api('v1/users/get-data-for-user-agent-datasets', {
    method: 'GET',
    allAgents: true,
  });
}

export default getDataForUserAgentDatasets;
