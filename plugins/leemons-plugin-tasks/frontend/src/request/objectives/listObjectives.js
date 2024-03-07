export default async function listObjectivesRequest(id) {
  if (!id) {
    return [];
  }

  const response = await leemons.api(`v1/tasks/${id}/objectives`);
  const { objectives } = response;

  return objectives;
}
