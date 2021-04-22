module.exports = {
  modelName: 'posts',
  collectionName: 'posts',
  options: {
    useTimestamps: true,
  },
  attributes: {
    title: {
      type: 'string',
      length: 64,
      options: {
        notNull: true,
      },
    },
    body: {
      specificType: 'text',
      options: {
        notNull: true,
      },
    },
    author: {
      references: {
        collection: 'plugins_user-admin::users',
        relation: 'one to many',
      },
      options: {
        notNull: true,
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
