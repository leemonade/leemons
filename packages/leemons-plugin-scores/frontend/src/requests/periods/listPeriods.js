export default function listPeriods({ page, size, query, sort }) {
  return leemons.api(
    `scores/periods?${Object.entries({ ...query, size, page, sort })
      .map(([key, value]) => `${key}=${value}`)
      .join('&')}`,
    {
      method: 'GET',
      useAllAgents: true,
    }
  );
}
