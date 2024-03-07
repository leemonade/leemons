export default async function sendReminder(body) {
  return leemons.api(`v1/assignables/assignableInstances/reminder`, {
    method: 'POST',
    body,
    allAgents: true,
  });
}
