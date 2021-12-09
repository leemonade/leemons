export default async function getAllLevelParents(id, locale = null) {
  const { status, levels, error } = await leemons.api({
    url: `classroom/level/all-parents/:id${locale ? `?locale=${locale}` : ''}`,
    allAgents: true,
    query: { id },
  });
  if (status === 200) {
    return levels;
  }
  return { status, error };
}
