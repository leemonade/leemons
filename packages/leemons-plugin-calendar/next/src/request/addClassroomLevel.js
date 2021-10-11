async function addClassroomLevel(config) {
  return leemons.api(
    {
      url: 'calendar/classroom-level/add',
      allAgents: true,
    },
    {
      method: 'POST',
      body: {
        config,
      },
    }
  );
}

export default addClassroomLevel;
