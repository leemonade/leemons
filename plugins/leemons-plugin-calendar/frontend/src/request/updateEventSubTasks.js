async function updateEventSubTasks(id, subtask) {
  return leemons.api('v1/calendar/calendar/update/event-subtask', {
    method: 'POST',
    body: {
      id,
      subtask,
    },
  });
}

export default updateEventSubTasks;
