module.exports = {
  modelName: 'users',
  collectionName: 'users',
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
    surnames: {
      type: 'string',
    },
    email: {
      type: 'string',
      options: {
        unique: true,
        notNull: true,
      },
    },
    password: {
      type: 'string',
      hidden: true,
      options: {
        notNull: true,
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
