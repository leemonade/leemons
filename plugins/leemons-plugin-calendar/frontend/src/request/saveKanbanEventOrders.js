async function saveKanbanEventOrders(centerToken, column, events) {
  return leemons.api('v1/calendar/calendar/kanban/save/event/orders', {
    centerToken,
    method: 'POST',
    body: {
      column,
      events,
    },
  });
}

export default saveKanbanEventOrders;
