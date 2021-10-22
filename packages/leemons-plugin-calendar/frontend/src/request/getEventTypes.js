async function getEventTypes() {
  return leemons.api('calendar/event-types', {
    allAgents: true,
  });
}

export default getEventTypes;
