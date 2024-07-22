async function getDataForUserAgentDatasets(userAgentId) {
  let params = '';

  if (userAgentId) {
    params = `?userAgentId=${userAgentId}`;
  }
  return leemons.api(`v1/users/users/get-data-for-user-agent-datasets${params}`, {
    method: 'GET',
    allAgents: true,
  });
}

export default getDataForUserAgentDatasets;
