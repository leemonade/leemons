async function saveKanbanEventOrders(centerToken, column, events) {
  return leemons.api('calendar/kanban/save/event/orders', {
    centerToken,
    method: 'POST',
    body: {
      column,
      events,
    },
  });
}

export default saveKanbanEventOrders;
