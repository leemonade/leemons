async function detailClassroomLevel(id) {
  return leemons.api({
    url: 'calendar/classroom-level/detail/:id',
    allAgents: true,
    query: { id },
  });
}

export default detailClassroomLevel;
