export default async function getAssignableInstances({
  ids,
  details = true,
  relatedInstances,
  throwOnMissing,
}) {
  if (!ids?.length) {
    return [];
  }

  const idsQuery = ids.map((id) => `ids=${id}`).join('&');

  let query = `details=${details}`;
  if (relatedInstances) {
    query += '&relatedInstances=true';
  }
  if (!throwOnMissing) {
    query += '&throwOnMissing=false';
  }

  const apiData = await leemons.api(`assignables/assignableInstances/find?${query}&${idsQuery}`, {
    method: 'GET',
    allAgents: true,
  });

  return apiData.instances;
}
