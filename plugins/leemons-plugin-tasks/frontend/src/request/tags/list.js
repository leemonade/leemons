export default async function list() {
  const result = await leemons.api('v1/tasks/tasks/tags/list');

  return result.tags;
}
