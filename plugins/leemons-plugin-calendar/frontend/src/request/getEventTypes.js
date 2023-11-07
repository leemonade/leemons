async function getEventTypes() {
  return leemons.api('v1/calendar/calendar/event-types', {
    allAgents: true,
  });
}

export default getEventTypes;
