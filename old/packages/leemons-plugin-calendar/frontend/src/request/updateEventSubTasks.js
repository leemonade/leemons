async function updateEventSubTasks(id, subtask) {
  return leemons.api('calendar/update/event-subtask', {
    method: 'POST',
    body: {
      id,
      subtask,
    },
  });
}

export default updateEventSubTasks;
