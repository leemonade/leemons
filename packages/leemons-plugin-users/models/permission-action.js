module.exports = {
  modelName: 'permission-action',
  collectionName: 'permission-action',
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
  },
  primaryKey: {
    type: 'uuid',
  },
};
