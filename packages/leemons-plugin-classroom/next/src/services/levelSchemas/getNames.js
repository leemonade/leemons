export default async function getNames(id) {
  if (!id) {
    return [];
  }
  const {
    status,
    levelSchema: { names },
    error,
  } = await leemons.api({
    url: `classroom/levelschema/${id}/names`,
    allAgents: true,
  });
  if (status === 200) {
    return names;
  }
  return { status, error };
}
