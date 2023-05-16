module.exports = {
  modelName: 'kanban-columns',
  collectionName: 'kanban-columns',
  options: {
    useTimestamps: true,
  },
  attributes: {
    order: {
      type: 'number',
    },
    isDone: {
      type: 'boolean',
    },
    isArchived: {
      type: 'boolean',
    },
    bgColor: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
