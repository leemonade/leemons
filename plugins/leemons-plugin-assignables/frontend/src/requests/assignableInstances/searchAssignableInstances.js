export default async function searchAssignableInstances(query) {
  const result = await leemons.api(
    `v1/assignables/assignableInstances/search?${Object.entries(query)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')}`,
    {
      allAgents: true,
      method: 'GET',
    }
  );

  return result?.assignableInstances || [];
}
