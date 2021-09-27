export default async function listLevelSchemas(locale = null) {
  const { status, items, error } = await leemons.api({
    url: `classroom/levelschema${locale ? `?locale=${locale}` : ''}`,
    allAgents: true,
  });
  if (status === 200) {
    return items;
  }
  return { status, error };
}
