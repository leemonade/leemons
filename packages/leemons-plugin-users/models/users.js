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
      options: {
        hidden: true,
      },
    },
    locale: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    active: {
      type: 'boolean',
      options: {
        notNull: true,
        defaultTo: false,
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
