async function listKanbanEventOrders(centerToken) {
  return leemons.api('v1/calendar/calendar/kanban/list/event/orders', {
    centerToken,
  });
}

export default listKanbanEventOrders;
