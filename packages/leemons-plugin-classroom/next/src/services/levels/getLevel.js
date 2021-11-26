export default async function getLevel(id, locale = null) {
  const { status, level, error } = await leemons.api({
    url: `classroom/level/:id${locale ? `?locale=${locale}` : ''}`,
    allAgents: true,
    query: { id },
  });
  if (status === 200) {
    return level;
  }
  return { status, error };
}
