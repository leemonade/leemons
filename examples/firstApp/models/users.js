module.exports = {
  collectionName: 'users',
  info: {
    name: 'users',
    description: 'Los usuarios',
  },
  options: {},
  attributes: {
    name: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    password: {
      type: 'string',
      hidden: true,
    },
  },
};
