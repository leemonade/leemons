const kanbanColumns = require('../src/services/kanban-columns');
const kanbanEventOrders = require('../src/services/kanban-event-orders');

module.exports = {
  listColumns: kanbanColumns.list,
  listEventOrders: kanbanEventOrders.list,
};
