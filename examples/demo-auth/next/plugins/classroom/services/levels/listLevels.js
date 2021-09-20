export default async function listLevels(locale = null) {
  const { status, items, error } = await leemons.api(
    `classroom/level${locale ? `?locale=${locale}` : ''}`
  );
  if (status === 200) {
    return items;
  }
  return { status, error };
}
