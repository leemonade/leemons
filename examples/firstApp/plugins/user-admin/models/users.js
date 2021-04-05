module.exports = {
  modelName: 'users',
  collectionName: 'users',
  attributes: {
    name: {
      type: 'string',
    },
    email: {
      type: 'string',
      options: {
        unique: true,
      },
    },
    password: {
      type: 'string',
      hidden: true,
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
