export default async function addDeliverableRequest({ instance, user, type, deliverable }) {
  return leemons.api(`v1/tasks/tasks/instances/${instance}/${user}/deliverables/${type}`, {
    method: 'POST',
    body: {
      deliverable,
    },
  });
}
