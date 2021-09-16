export default async function getNames(id) {
  if (!id) {
    return { id, names: [] };
  }
  const { status, levelSchema, error } = await leemons.api({
    url: `classroom/levelschema/${id}/names`,
    allAgents: true,
  });
  if (status === 200) {
    return levelSchema;
  }
  return { status, error };
}
