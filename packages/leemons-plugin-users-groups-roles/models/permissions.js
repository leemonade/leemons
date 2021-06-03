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
    permission_name: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    plugin_name: {
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
