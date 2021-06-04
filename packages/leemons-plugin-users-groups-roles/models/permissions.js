module.exports = {
  modelName: 'permissions',
  collectionName: 'permissions',
  options: {
    useTimestamps: true,
  },
  attributes: {
    name: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    permissionName: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    pluginName: {
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
