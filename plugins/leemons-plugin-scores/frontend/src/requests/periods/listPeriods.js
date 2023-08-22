export default function listPeriods({ page, size, query, sort }) {
  return leemons.api(
    `scores/periods?${Object.entries({ ...query, size, page, sort })
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')}`,
    {
      method: 'GET',
      useAllAgents: true,
    }
  );
}
