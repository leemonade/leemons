async function listKanbanEventOrders(centerToken) {
  return leemons.api('calendar/kanban/list/event/orders', {
    centerToken,
  });
}

export default listKanbanEventOrders;
