async function listKanbanEventOrders(centerToken) {
  return leemons.api({
    url: 'calendar/kanban/list/event/orders',
    centerToken,
  });
}

export default listKanbanEventOrders;
