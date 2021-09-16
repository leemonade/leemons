export default async function listLevels(locale = null) {
  const { status, items, error } = await leemons.api({
    url: `classroom/level${locale ? `?locale=${locale}` : ''}`,
    allAgents: true,
  });
  if (status === 200) {
    return items;
  }
  return { status, error };
}
