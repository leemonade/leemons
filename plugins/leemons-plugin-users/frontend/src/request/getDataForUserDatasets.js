async function getDataForUserDatasets(userId) {
  let params = '';

  if (userId) {
    params = `?userId=${userId}`;
  }
  return leemons.api(`v1/users/users/get-data-for-user-datasets${params}`, {
    method: 'GET',
    allAgents: true,
  });
}

export default getDataForUserDatasets;
