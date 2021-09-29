async function saveKanbanEventOrders(centerToken, column, events) {
  return leemons.api(
    {
      url: 'calendar/kanban/save/event/orders',
      centerToken,
    },
    {
      method: 'POST',
      body: {
        column,
        events,
      },
    }
  );
}

export default saveKanbanEventOrders;
