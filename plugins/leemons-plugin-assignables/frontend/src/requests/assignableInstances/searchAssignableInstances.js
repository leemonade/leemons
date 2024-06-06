export default async function searchAssignableInstances(query) {
  const result = await leemons.api(
    `v1/assignables/assignableInstances/search?${Object.entries(query)
      .map(([key, value]) => {
        if (value === undefined) return null;

        if (Array.isArray(value)) {
          return value.map((v) => `${key}=${v}`).join('&');
        }
        return `${key}=${value}`;
      })
      .filter(Boolean)
      .join('&')}`,
    {
      allAgents: true,
      method: 'GET',
    }
  );

  return result?.assignableInstances || [];
}
