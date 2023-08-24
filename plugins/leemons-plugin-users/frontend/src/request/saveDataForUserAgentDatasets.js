async function saveDataForUserAgentDatasets(body) {
  return leemons.api('users/save-data-for-user-agent-datasets', {
    method: 'POST',
    allAgents: true,
    body,
  });
}

export default saveDataForUserAgentDatasets;
