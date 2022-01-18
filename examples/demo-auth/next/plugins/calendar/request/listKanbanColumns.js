async function listKanbanColumns() {
  return leemons.api('calendar/kanban/list/columns', {
    allAgents: true,
  });
}

export default listKanbanColumns;
