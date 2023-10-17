export default async function getAssignations({
  queries,
  details = true,
  throwOnMissing = true,
  fetchInstance,
}) {
  if (!queries?.length) {
    return [];
  }

  const idsQuery = queries
    .map(({ instance, user, id }) => {
      if (id) {
        return { id };
      }
      return { instance, user };
    })
    .map((q) => `queries=${JSON.stringify(q)}`)
    .join('&');

  let query = `details=${details}`;

  if (!throwOnMissing) {
    query += `&throwOnMissing=false`;
  }
  if (fetchInstance) {
    query += '&fetchInstance=true';
  }

  const response = await leemons.api(`assignables/assignations/find?&${query}&${idsQuery}`, {
    method: 'GET',
    allAgents: true,
  });

  return response.assignations;
}
