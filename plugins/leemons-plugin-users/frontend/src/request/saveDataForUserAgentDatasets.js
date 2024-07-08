async function saveDataForUserAgentDatasets(body) {
  return leemons.api('v1/users/users/save-data-for-user-agent-datasets', {
    method: 'POST',
    allAgents: true,
    body,
  });
}

export default saveDataForUserAgentDatasets;
