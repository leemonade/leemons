export default async function getAssignableInstance({ ids, details = true }) {
  return Promise.all(
    ids.map(async (id) => {
      const apiData = await leemons.api(
        `assignables/assignableInstances/${id}?details=${details}`,
        {
          method: 'GET',
          allAgents: true,
        }
      );
      return apiData.assignableInstance;
    })
  );
}
