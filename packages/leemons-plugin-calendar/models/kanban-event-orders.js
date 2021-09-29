module.exports = {
  modelName: 'kanban-event-orders',
  collectionName: 'kanban-event-orders',
  options: {
    useTimestamps: true,
  },
  attributes: {
    userAgent: {
      references: {
        collection: 'plugins_users::user-agent',
      },
    },
    column: {
      references: {
        collection: 'plugins_calendar::kanban-columns',
      },
    },
    events: {
      type: 'json',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
