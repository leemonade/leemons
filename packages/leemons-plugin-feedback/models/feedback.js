module.exports = {
  modelName: 'feedback',
  collectionName: 'feedback',
  options: {
    useTimestamps: true,
  },
  attributes: {
    introductoryText: {
      type: 'string',
    },
    featuredImage: {
      type: 'string',
    },
    asset: {
      type: 'string',
    },
  },
  primaryKey: {
    name: 'id',
    specificType: 'varchar(255)',
  },
};
