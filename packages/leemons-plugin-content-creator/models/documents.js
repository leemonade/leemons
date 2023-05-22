module.exports = {
  modelName: 'documents',
  collectionName: 'documents',
  attributes: {
    content: {
      type: 'richtext',
    },
    assignable: {
      type: 'string',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
