async function getEventTypes() {
  return leemons.api({
    url: 'calendar/event-types',
    allAgents: true,
  });
}

export default getEventTypes;
