async function listKanbanColumns() {
  return leemons.api('v1/calendar/calendar/kanban/list/columns', {
    allAgents: true,
  });
}

export default listKanbanColumns;
