export default async function getDeliverableRequest({ instance, student, type }) {
  return leemons.api(`tasks/tasks/instances/${instance}/${student}/deliverables/${type}`, {
    method: 'GET',
  });
}
