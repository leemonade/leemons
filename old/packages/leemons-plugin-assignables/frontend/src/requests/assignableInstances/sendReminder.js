export default async function sendReminder(body) {
  return leemons.api(`assignables/assignableInstances/reminder`, {
    method: 'POST',
    body,
    allAgents: true,
  });
}
