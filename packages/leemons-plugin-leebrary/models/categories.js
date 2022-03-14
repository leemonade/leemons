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
    creatable: {
      type: 'boolean',
      options: {
        defaultTo: false,
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
