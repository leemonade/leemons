module.exports = {
  modelName: 'families',
  collectionName: 'families',
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
    group: {
      references: {
        collection: 'plugins_users::groups',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
