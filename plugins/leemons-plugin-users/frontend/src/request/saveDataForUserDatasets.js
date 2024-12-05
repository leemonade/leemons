async function saveDataForUserDatasets(body) {
  return leemons.api('v1/users/users/save-data-for-user-datasets', {
    method: 'POST',
    allAgents: true,
    body,
  });
}

export default saveDataForUserDatasets;
