module.exports = {
  modelName: 'feedback',
  collectionName: 'feedback',
  options: {
    useTimestamps: true,
  },
  attributes: {
    asset: {
      type: 'string',
    },
  },
  primaryKey: {
    name: 'id',
    specificType: 'varchar(255)',
  },
};
