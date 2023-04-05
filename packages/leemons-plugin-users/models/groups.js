module.exports = {
  modelName: 'groups',
  collectionName: 'groups',
  options: {
    useTimestamps: true,
  },
  attributes: {
    name: {
      type: 'string',
    },
    type: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    uri: {
      type: 'string',
    },
    indexable: {
      type: 'boolean',
      options: {
        notNull: true,
        defaultTo: true,
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
