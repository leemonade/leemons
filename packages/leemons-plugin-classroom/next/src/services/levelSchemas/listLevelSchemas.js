export default async function listLevelSchemas(locale = null) {
  const { status, items, error } = await leemons.api(
    `classroom/levelschema${locale ? `?locale=${locale}` : ''}`
  );
  if (status === 200) {
    return items;
  }
  return { status, error };
}
