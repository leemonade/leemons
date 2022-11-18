module.exports = {
  modelName: 'item-permissions',
  collectionName: 'item-permissions',
  options: {
    useTimestamps: true,
  },
  attributes: {
    permissionName: {
      type: 'text',
      options: {
        notNull: true,
        index: true,
        indexOptions: {
          indexType: 'FULLTEXT',
        },
      },
    },
    actionName: {
      type: 'string',
      options: {
        notNull: true,
        index: true,
      },
    },
    target: {
      type: 'string',
      options: {
        index: true,
      },
    },
    type: {
      type: 'string',
      options: {
        notNull: true,
        index: true,
      },
    },
    item: {
      type: 'string',
      options: {
        notNull: true,
        index: true,
      },
    },
    center: {
      type: 'text',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
