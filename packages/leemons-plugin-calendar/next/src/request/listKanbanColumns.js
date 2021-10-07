async function listKanbanColumns() {
  return leemons.api({
    url: 'calendar/kanban/list/columns',
    allAgents: true,
  });
}

export default listKanbanColumns;
