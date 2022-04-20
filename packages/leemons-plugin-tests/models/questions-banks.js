module.exports = {
  modelName: 'questions-banks',
  collectionName: 'questions-banks',
  options: {
    useTimestamps: true,
  },
  attributes: {
    name: {
      type: 'string',
      required: true,
    },
    published: {
      type: 'boolean',
      options: {
        defaultTo: false,
      },
    },
  },
  primaryKey: {
    name: 'id',
    specificType: 'varchar(255)',
  },
};
