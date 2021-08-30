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
      },
    },
    actionName: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    target: {
      type: 'string',
    },
    type: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    item: {
      type: 'string',
      options: {
        notNull: true,
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
