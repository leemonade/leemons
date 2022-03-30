module.exports = {
  modelName: 'statement',
  collectionName: 'statement',
  connection: 'mongodb',
  options: {
    useTimestamps: true,
  },
  attributes: {
    statement: {
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
    person: {
      type: 'string',
    },
    organization: {
      type: 'string',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
