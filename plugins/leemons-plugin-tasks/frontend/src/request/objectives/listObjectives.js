export default async function listObjectivesRequest(id) {
  if (!id) {
    return [];
  }

  const response = await leemons.api(`tasks/${id}/objectives`);
  const { objectives } = response;

  return objectives;
}
