module.exports = {
  modelName: 'permissions',
  collectionName: 'permissions',
  options: {
    useTimestamps: true,
  },
  attributes: {
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
