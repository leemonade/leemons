export default async function getDeliverableRequest({ instance, student, type }) {
  return leemons.api(`v1/tasks/tasks/instances/${instance}/${student}/deliverables/${type}`, {
    method: 'GET',
  });
}
