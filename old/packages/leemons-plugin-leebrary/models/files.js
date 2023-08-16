module.exports = {
  modelName: 'files',
  collectionName: 'files',
  options: {
    useTimestamps: true,
  },
  attributes: {
    provider: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    type: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    extension: {
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
    size: {
      type: 'bigint',
      options: {
        defaultTo: 0,
      },
    },
    uri: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    isFolder: {
      type: 'boolean',
    },
    metadata: {
      type: 'text',
      textType: 'mediumText',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
