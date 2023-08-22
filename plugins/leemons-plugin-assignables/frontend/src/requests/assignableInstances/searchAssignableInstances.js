export default async function searchAssignableInstances(query) {
  const result = await leemons.api(
    `assignables/assignableInstances/search?${Object.entries(query)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')}`,
    {
      allAgents: true,
      method: 'GET',
    }
  );

  return result?.assignableInstances || [];
}
