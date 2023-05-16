export default async function getAssignablesRequest(ids, { withFiles, deleted } = {}) {
  const idsToUse = Array.isArray(ids) ? ids : [ids];

  const idsParams = idsToUse.map((id) => `ids=${id}`).join('&');
  const url = `assignables/assignables/find?${idsParams}&withFiles=${!!withFiles}&deleted=${!!deleted}`;

  const response = await leemons.api(url, {
    method: 'GET',
    allAgents: true,
  });

  return response?.assignables;
}
