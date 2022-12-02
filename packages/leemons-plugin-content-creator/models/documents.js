module.exports = {
  modelName: 'documents',
  collectionName: 'documents',
  attributes: {
    asset: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    content: {
      type: 'richtext',
    },
    schema: {
      type: 'text',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
