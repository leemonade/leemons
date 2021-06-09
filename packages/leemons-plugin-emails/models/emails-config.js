module.exports = {
  modelName: 'emails-config',
  collectionName: 'emails-config',
  options: {
    useTimestamps: true,
  },
  attributes: {
    transport: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    name: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    host: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    port: {
      type: 'integer',
      options: {
        notNull: true,
      },
    },
    secure: {
      type: 'boolean',
      options: {
        notNull: true,
      },
    },
    user: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    pass: {
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
