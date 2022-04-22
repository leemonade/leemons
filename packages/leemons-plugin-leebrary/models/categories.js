module.exports = {
  modelName: 'categories',
  collectionName: 'categories',
  attributes: {
    key: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    pluginOwner: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    creatable: {
      type: 'boolean',
      options: {
        defaultTo: false,
      },
    },
    duplicable: {
      type: 'boolean',
      options: {
        defaultTo: false,
      },
    },
    provider: {
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
