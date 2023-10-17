export default async function list() {
  const result = await leemons.api('tasks/tasks/tags/list');

  return result.tags;
}
